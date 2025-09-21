import type { NextApiRequest, NextApiResponse } from 'next'
import { CloudTasksClient, protos } from '@google-cloud/tasks'
import { auth } from 'google-auth-library'

import { generateUniqueTaskPrefix, TriggerSmsReminderInput } from '@/notifications/helper-functions/gcpTaskHelpers'

const project = process.env.GCP_PROJECT as string
const queue = process.env.GCP_TASK_QUEUE as string
const region = process.env.GCP_PRIMARY_REGION as string
const cloudFunctionUrl = process.env.GCP_CLOUD_FUNCTION_URL_SEND_REMINDER as string
const cloudFunctionEmail = process.env.GCP_CLOUD_FUNCTION_SERVICE_ACCOUNT_EMAIL as string

/**
 * Normally, one might read credentials from a JSON file, or simply use Google Cloud functionality for auth.
 * In our case, to run this locally and on Vercel, we pass in the credentials as an environment variable.
 * Base64-encoding is used to avoid any issues due to newlines and so on.
 * This is NOT encrypted, and by default does not expire, so handle with care (we can always disable keys if needed).
 * The value was generated with "cat credentials.json | base64 -w 0 > base64_credentials.txt"
 */
const gcpCredentialBase64 = process.env.GCP_SERVICE_ACCOUNT_CREDENTIALS_BASE64 as string
const credential = JSON.parse(
  Buffer.from(gcpCredentialBase64, 'base64').toString().replace(/\n/g,"")
)
auth.fromJSON(credential)
const client = new CloudTasksClient({
  auth: auth
})

// Based on https://cloud.google.com/tasks/docs/creating-http-target-tasks#advanced_task_creation_createtask_method
async function createHttpTask(nickname: string, phone: string, location: string, notificationDate: string, moveByDate: string) {
  const parent = client.queuePath(project, region, queue)

  const hardCodedBody: TriggerSmsReminderInput = {
    phone_number: phone,
    vehicle_nickname: nickname,
    location: location,
    timestamp: moveByDate
  }

  const taskPrefix = generateUniqueTaskPrefix(hardCodedBody)

  const name = client.taskPath(project, region, queue, taskPrefix+'_'+Date.now())


  const scheduledNotificationTime = new Date(notificationDate) // From ISO string
  const task: protos.google.cloud.tasks.v2.ITask = {
    name: name,
    httpRequest: {
      headers: {
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
      url: cloudFunctionUrl,
      body: Buffer.from(JSON.stringify(hardCodedBody)).toString("base64"),
      oidcToken: {
        serviceAccountEmail: cloudFunctionEmail,
      },
    },
    scheduleTime: {
      seconds: Math.floor(scheduledNotificationTime.getTime()/1000)
    }
  }

  // Cancel an existing task if one exists, and then send the latest/new one

  // 1. List all active tasks and figure out if any will be replaced
  const listTasksRequest: protos.google.cloud.tasks.v2.IListTasksRequest = {
    parent: client.queuePath(project, region, queue),
    responseView: "BASIC"
  }

  const existingTasks = []
  for await (const task of client.listTasksAsync(listTasksRequest)) {
    existingTasks.push(task)
  }

  // Extract task ID (the last path segment of task.name)
  const tasksToCancel = existingTasks.filter((task) => {
    const taskId = task.name?.split("/").pop() ?? ""
    return taskId.startsWith(taskPrefix)
  })

  if (tasksToCancel.length > 0) {
    console.log(`Found ${tasksToCancel.length} tasks to cancel`)
  } else {
    console.log(`No tasks to cancel`)
  }
  

  // 2. Delete said tasks (if it still exists)
  for (const task of tasksToCancel) {
    if (task.name) {
      const deleteTaskRequest: protos.google.cloud.tasks.v2.IDeleteTaskRequest = {
        name: task.name
      }
      await client.deleteTask(deleteTaskRequest)
      console.log(`Successfully deleted ${task.name}`)
    }
  }
  
  // 3. Send create task request.
  const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = { parent: parent, task: task }
  const [response] = await client.createTask(request)
  console.log(`Created task ${response.name}`)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await createHttpTask(req.body.nickname, req.body.phone, req.body.location, req.body.notificationDate, req.body.moveByDate)
    return res.status(200).json({ message: 'API is working', nickname: req.body.nickname })
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

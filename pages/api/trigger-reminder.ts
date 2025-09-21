import type { NextApiRequest, NextApiResponse } from 'next'
import { CloudTasksClient, protos } from '@google-cloud/tasks'
import { auth } from 'google-auth-library'

import { generateUniqueTaskIdentifier, TriggerReminderInput } from '@/notifications/helper-functions/gcpTaskHelpers'

const project = process.env.GCP_PROJECT as string
const queue = process.env.GCP_TASK_QUEUE as string
const location = process.env.GCP_PRIMARY_REGION as string
const cloudFunctionUrl = process.env.GCP_CLOUD_FUNCTION_URL_SEND_REMINDER as string
const cloudFunctionEmail = process.env.GCP_CLOUD_FUNCTION_SERVICE_ACCOUNT_EMAIL as string
const inSeconds = 0

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
async function createHttpTask(nickname: string = 'DEFAULT') {
  const parent = client.queuePath(project, location, queue)

  // TODO: Modify this function to accept input for the following fields (as accepted by the current email template)
  const hardCodedBody: TriggerReminderInput = {
    to_email: 'luhcforgh@gmail.com',
    vehicle_nickname: nickname,
    location: {
      name: 'Storgatan 12',
      lat: 59.330741,
      lng: 18.032743
    },
    move_by_timestamp: '2024-05-02T16:10:18Z'
  }

  const name = client.taskPath(project, location, queue, generateUniqueTaskIdentifier(hardCodedBody))

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
      seconds: inSeconds + Date.now() / 1000,
    }
  }

  // Cancel an existing task if one exists, and then send the last one

  // 1. Get task by unique id
  const getTaskRequest: protos.google.cloud.tasks.v2.IGetTaskRequest = {
    name,
    responseView: "BASIC", // "FULL" (reqires additional permissions)
  }
  const existingTask = await client.getTask()

  // 2. Delete said task (if it still exists)
  // TODO: Does this work if it has failed too? Can I update it instead?
  /**
   * Explicitly specifying a task ID enables task de-duplication.
   * If a task's ID is identical to that of an existing task or a task that was
   * deleted or executed recently then the call will fail with protos.google.rpc.Code.ALREADY_EXISTS ALREADY_EXISTS.
   * If the task's queue was created using Cloud Tasks, then another task with 
   * the same name can't be created for ~1hour after the original task was deleted or executed. 
   */
  if (existingTask) {
    const deleteTaskRequest: protos.google.cloud.tasks.v2.IDeleteTaskRequest = {
      name
    }
    await client.deleteTask(deleteTaskRequest)
  }

  //await client.updateTask() THIS DOES NOT SEEM TO EXIST. I COULD ADD TO THE SUFFIX, AND SEE IF MARKED AS DELETED???
  // Perhaps it is possible to list ALL existing tasks, perform a regex matching to find the latest (max one non-finished?), and delete that.
  // The name for a new task also has to know which "version" to append.
  
  // 3. Send create task request.
  const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = { parent: parent, task: task }
  const [response] = await client.createTask(request)
  console.log(`Created task ${response.name}`)

  // 4. Return 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await createHttpTask(req.body.nickname)
    return res.status(200).json({ message: 'API is working', nickname: req.body.nickname })
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

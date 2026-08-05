import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleAuth } from 'google-auth-library'

import { generateUniqueTaskPrefix, TriggerSmsReminderInput } from '@/notifications/helper-functions/gcpTaskHelpers'

const project = process.env.GCP_PROJECT as string
const queue = process.env.GCP_TASK_QUEUE as string
const region = process.env.GCP_PRIMARY_REGION as string
const cloudFunctionUrl = process.env.GCP_CLOUD_FUNCTION_URL_SEND_REMINDER as string
const cloudFunctionEmail = process.env.GCP_CLOUD_FUNCTION_SERVICE_ACCOUNT_EMAIL as string

const CLOUD_TASKS_API = 'https://cloudtasks.googleapis.com/v2'

/**
 * The Cloud Tasks REST API is used directly rather than via @google-cloud/tasks, which talks gRPC
 * over Node's native http2 module. That transport segfaults the whole process on Vercel when a
 * pooled HTTP/2 session goes stale (see nodejs/node#61304), which surfaces as an unloggable
 * SIGSEGV instead of a catchable error. Plain HTTPS has no such failure mode.
 */
interface CloudTask {
  name?: string
  scheduleTime?: string
  httpRequest?: {
    url: string
    httpMethod: string
    headers?: Record<string, string>
    body?: string
    oidcToken?: { serviceAccountEmail: string }
  }
}

/**
 * Normally, one might read credentials from a JSON file, or simply use Google Cloud functionality for auth.
 * In our case, to run this locally and on Vercel, we pass in the credentials as an environment variable.
 * Base64-encoding is used to avoid any issues due to newlines and so on.
 * This is NOT encrypted, and by default does not expire, so handle with care (we can always disable keys if needed).
 * The value was generated with "cat credentials.json | base64 -w 0 > base64_credentials.txt"
 */
let auth: GoogleAuth | undefined
function getAuth() {
  if (!auth) {
    const gcpCredentialBase64 = process.env.GCP_SERVICE_ACCOUNT_CREDENTIALS_BASE64
    if (!gcpCredentialBase64) {
      throw new Error('Missing GCP_SERVICE_ACCOUNT_CREDENTIALS_BASE64 environment variable')
    }

    let credentials
    try {
      credentials = JSON.parse(
        Buffer.from(gcpCredentialBase64, 'base64').toString().replace(/\n/g, '')
      )
    } catch (error) {
      throw new Error(`Could not parse GCP_SERVICE_ACCOUNT_CREDENTIALS_BASE64 as JSON: ${error}`)
    }

    auth = new GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
  }
  return auth
}

async function cloudTasksRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const accessToken = await getAuth().getAccessToken()

  const response = await fetch(`${CLOUD_TASKS_API}/${path}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const responseText = await response.text()
  if (!response.ok) {
    throw new Error(`Cloud Tasks ${method} ${path} failed (${response.status}): ${responseText}`)
  }

  // Deletions respond with an empty body rather than the "{}" that JSON.parse would need
  return (responseText ? JSON.parse(responseText) : {}) as T
}

function queuePath() {
  return `projects/${project}/locations/${region}/queues/${queue}`
}

async function listTasks() {
  const tasks: CloudTask[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({ responseView: 'BASIC' })
    if (pageToken) { params.set('pageToken', pageToken) }

    const page = await cloudTasksRequest<{ tasks?: CloudTask[], nextPageToken?: string }>(
      'GET', `${queuePath()}/tasks?${params}`
    )
    tasks.push(...(page.tasks ?? []))
    pageToken = page.nextPageToken || undefined
  } while (pageToken)

  return tasks
}

// Based on https://cloud.google.com/tasks/docs/creating-http-target-tasks#advanced_task_creation_createtask_method
async function createHttpTask(nickname: string, phone: string, location: string, notificationDate: string, moveByDate: string) {
  const hardCodedBody: TriggerSmsReminderInput = {
    phone_number: phone,
    vehicle_nickname: nickname,
    location: location,
    timestamp: moveByDate
  }

  const taskPrefix = generateUniqueTaskPrefix(hardCodedBody)

  const scheduledNotificationTime = new Date(notificationDate) // From ISO string
  if (isNaN(scheduledNotificationTime.getTime())) {
    throw new Error(`Invalid notificationDate: ${notificationDate}`)
  }

  const task: CloudTask = {
    name: `${queuePath()}/tasks/${taskPrefix}_${Date.now()}`,
    httpRequest: {
      headers: {
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
      url: cloudFunctionUrl,
      body: Buffer.from(JSON.stringify(hardCodedBody)).toString('base64'),
      oidcToken: {
        serviceAccountEmail: cloudFunctionEmail,
      },
    },
    scheduleTime: scheduledNotificationTime.toISOString()
  }

  // Cancel an existing task if one exists, and then send the latest/new one

  // 1. List all active tasks and figure out if any will be replaced
  const existingTasks = await listTasks()

  // Extract task ID (the last path segment of task.name)
  const tasksToCancel = existingTasks.filter((task) => {
    const taskId = task.name?.split('/').pop() ?? ''
    return taskId.startsWith(taskPrefix)
  })

  if (tasksToCancel.length > 0) {
    console.log(`Found ${tasksToCancel.length} tasks to cancel`)
  } else {
    console.log('No tasks to cancel')
  }

  // 2. Delete said tasks (if it still exists)
  for (const taskToCancel of tasksToCancel) {
    if (taskToCancel.name) {
      await cloudTasksRequest('DELETE', taskToCancel.name)
      console.log(`Successfully deleted ${taskToCancel.name}`)
    }
  }

  // 3. Send create task request.
  const response = await cloudTasksRequest<CloudTask>('POST', `${queuePath()}/tasks`, { task: task })
  console.log(`Created task ${response.name}`)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    await createHttpTask(req.body.nickname, req.body.phone, req.body.location, req.body.notificationDate, req.body.moveByDate)
    return res.status(200).json({ message: 'API is working', nickname: req.body.nickname })
  } catch (error) {
    console.error('Failed to schedule reminder task:', error)
    return res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' })
  }
}

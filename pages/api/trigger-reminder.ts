import type { NextApiRequest, NextApiResponse } from 'next'
import { CloudTasksClient, protos } from '@google-cloud/tasks'
import { auth } from 'google-auth-library'

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
  const hardCodedBody = {
    to_email: 'luhcforgh@gmail.com',
    vehicle_nickname: nickname,
    location: {
      name: 'Storgatan 12',
      lat: 59.330741,
      lng: 18.032743
    },
    move_by_timestamp: '2024-05-02T16:10:18Z'
  }

  const name = client.taskPath(project, location, queue, `EMAIL_luhcforghgmailcom_${Date.now()}`)
  // TODO: Make sure this overwrites any existing tasks with the same name (use method, email, and nickname as input)
  // Note that @ and . had to be stripped! "letters ([A-Za-z]), numbers ([0-9]), hyphens (-), or underscores (_). Task ID must between 1 and 500 characters."
  // It might be easiest to ensure (supposed) uniqueness by hashing the full string, so that first.lastname and firstlastname doesn't become the same

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

  // Send create task request.
  const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = { parent: parent, task: task }
  const [response] = await client.createTask(request)
  console.log(`Created task ${response.name}`)
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

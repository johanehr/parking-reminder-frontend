import type { NextApiRequest, NextApiResponse } from 'next'
import { CloudTasksClient, protos } from '@google-cloud/tasks'
import { GoogleAuth, auth } from 'google-auth-library'

// TODO: For the real implementation, use environment variables or user input for these values
const project = 'parking-reminder-407014'
const queue = 'parking-reminder-task-queue'
const location = 'europe-west1'
const url = 'https://europe-west1-parking-reminder-407014.cloudfunctions.net/sendgridEmailScheduledReminder'
const inSeconds = 0

const gcpCredentialBase64 = process.env.APPENGINE_BASE64 as string // GOOGLE_CLOUD_CREDENTIALS_BASE64 as string
const credential = JSON.parse(
  Buffer.from(gcpCredentialBase64, 'base64').toString().replace(/\n/g,"")
)
console.log(JSON.stringify(credential, null, 2)) // TODO: REMOVE THIS! DISPLAYS SENSITIVE DATA

const serviceAccountCredential = auth.fromJSON(credential)

//const client2 = new CloudTasksClient(serviceAccountCredential)

const client = new CloudTasksClient(
  {
    auth: auth
  }
  /*
  {
    auth: new GoogleAuth({
      projectId: project,
      scopes: 'https://www.googleapis.com/auth/cloud-platform/', // 'https://www.googleapis.com/auth/tasks',
      credentials: {
        client_email: credential.client_email, // 'cloud-function@parking-reminder-407014.iam.gserviceaccount.com',
        private_key: credential.private_key, //.replace(/\n/g,""), // process.env.GOOGLE_CLOUD_TASKS_SERVICE_ACCOUNT_PRIVATE_KEY_NO_NEWLINE as string
      }
    })
  }
  */
)

// Based on https://cloud.google.com/tasks/docs/creating-http-target-tasks#advanced_task_creation_createtask_method
async function createHttpTask() {


  const parent = client.queuePath(project, location, queue)

  const hardCodedBody = {
    to_email: 'luhcforgh@gmail.com',
    vehicle_nickname: 'SENT_FROM_NEXTJS',
    location: {
      name: 'Storgatan 12',
      lat: 59.330741,
      lng: 18.032743
    },
    move_by_timestamp: '2024-05-02T16:10:18Z'
  }

  const name = client.taskPath(project, location, queue, `EMAIL_luhcforghgmailcom_${Date.now()}`)
  // TODO: Make sure this overwrites any existing tasks with the same name! Note that @ and . had to be stripped! "letters ([A-Za-z]), numbers ([0-9]), hyphens (-), or underscores (_). Task ID must between 1 and 500 characters."
  // It might be easiest to ensure (supposed) uniqueness by hashing the full string, so that first.lastname and firstlastname doesn't become the same

  const task: protos.google.cloud.tasks.v2.ITask = {
    name: name,
    httpRequest: {
      headers: {
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
      url,
      body: Buffer.from(JSON.stringify(hardCodedBody)).toString("base64"),
      oidcToken: { // TODO: This worked locally, but will likely have to be changed when running in the cloud!
        serviceAccountEmail: 'cloud-function@parking-reminder-407014.iam.gserviceaccount.com',
      },
    },
    scheduleTime: {
      seconds: inSeconds + Date.now() / 1000,
    }
  }

  // Send create task request.
  console.log('Sending task:')
  console.log(task)
  const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = { parent: parent, task: task }
  const [response] = await client.createTask(request)
  console.log(`Created task ${response.name}`)
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    // Handle the POST request here
    // You can access the request body using req.body
    console.log("This should not show up in the browser")
    createHttpTask()
    res.status(200).json({ message: 'API is working', nickname: req.body.nickname })
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

}

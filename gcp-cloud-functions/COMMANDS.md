# Using GCP Cloud Functions and Tasks To Send Email

## Preparations
gcloud auth application-default login
gcloud config set project parking-reminder-407014
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/application_default_credentials.json
export SENDGRID_API_KEY="YOUR_KEY_HERE" (production key)

Since https://app.sendgrid.com/settings/sender_auth has johanehrenfors@hotmail.com as a verified single sender, I modified this to be the sender in the code.

## Creating Cloud Function

A serverless cloud function is essentially a single endpoint that will perform some logic. In this project, the goal is to send an email. We can create a new cloud function for the "real" parking app.

### Running locally

You should be able to run the "serverless" server locally, as any NodeJS app to play around with it.

TODO: Verify this and document any quirks

### Deployment

TODO: How to handle versioning/testing

```
gcloud functions deploy sendgridEmailScheduledReminder --gen2 --runtime nodejs20 --trigger-http  --no-allow-unauthenticated --set-env-vars SENDGRID_API_KEY=<secret-redacted>,SENDGRID_SENDER_EMAIL=johanehrenfors@hotmail.com \
```

I selected europe-west1 for the environment (can be saved as a local setting, or maybe CLI argument?) and had to enable run.googleapis.com for the project (parking-reminder-407014) when prompted.

You can see the function here: https://console.cloud.google.com/functions/details/us-central1/sendgridEmailScheduledReminder?env=gen2&project=parking-reminder-407014

Cloud tasks queue for production:
https://console.cloud.google.com/cloudtasks/queue/europe-west1/parking-reminder-task-queue/tasks?project=parking-reminder-407014

The service accounts, which have sufficient rights to invoke the Cloud Function (roles: Cloud Functions Invoker + Cloud Run Invoker for supporting both 1st and 2nd gen functions):
https://console.cloud.google.com/iam-admin/serviceaccounts?project=parking-reminder-407014&supportedpurview=project

- parking-reminder-407014@appspot.gserviceaccount.com
- cloud-function@parking-reminder-407014.iam.gserviceaccount.com

### Invoking cloud function using CLI
To invoke the cloud function, you will need to be authenticated through GCP with a bearer token.

```
curl -m 70 -X POST https://europe-west1-parking-reminder-407014.cloudfunctions.net/sendgridEmailScheduledReminder -H "Authorization: bearer $(gcloud auth print-identity-token)" -H "Content-Type: application/json" -d '{ "to_email": "RECIPIENT EMAIL HERE", "to_name": "YOUR NAME HERE"'}
```

## Creating Tasks

A task is used to invoke the cloud function with specific data, either immediately, or at a scheduled time. For an example of setting a scheduled time, you can look at how the web app in gcp-backend does this.

### Using CLI

gcloud tasks create-http-task --queue=parking-reminder-task-queue --url=https://us-central1-parking-reminder-407014.cloudfunctions.net/sendgridEmailScheduledReminder myCliTaskWithJson --method=POST --header=Content-Type:application/json --body-file=cloudfunctionbody.txt --oidc-service-account-email=cloud-function@parking-reminder-407014.iam.gserviceaccount.com 
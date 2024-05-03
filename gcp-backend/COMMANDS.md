# Using GCP Cloud Functions and Tasks To Send Email

## Preparations
gcloud auth application-default login
gcloud config set project parking-reminder-407014
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/application_default_credentials.json
export SENDGRID_API_KEY="YOUR_KEY_HERE"

Since https://app.sendgrid.com/settings/sender_auth has johanehrenfors@hotmail.com as a verified single sender, I modified this to be the sender in the code.

## Creating Cloud Function

A serverless cloud function is essentially a single endpoint that will perform some logic. In this project, the goal is to send an email. We can create a new cloud function for the "real" parking app.

### Running locally

You should be able to run the "serverless" server locally, as any NodeJS app to play around with it.

### Deployment

```
gcloud functions deploy sendEmail --runtime nodejs20 --trigger-http   --no-allow-unauthenticated   --set-env-vars SENDGRID_API_KEY=<secret-redacted> \
```

> In a future Cloud SDK release, new functions will be deployed as 2nd gen  functions by default. This is equivalent to currently deploying new  with the --gen2 flag. Existing 1st gen functions will not be impacted and will continue to deploy as 1st gen functions. You can preview this behavior in beta. Alternatively, you can disable this behavior by explicitly specifying the --no-gen2 flag or by setting the functions/gen2 config property to 'off'. To learn more about the differences between 1st gen and 2nd gen functions, visit: https://cloud.google.com/functions/docs/concepts/version-comparison

You can see the function here: https://console.cloud.google.com/functions/details/us-central1/sendEmail?env=gen1&project=parking-reminder-407014

Cloud tasks queue for production:
https://console.cloud.google.com/cloudtasks/queue/europe-west1/parking-reminder-task-queue/tasks?project=parking-reminder-407014

The service accounts, which have sufficient rights to invoke the Cloud Function (roles: Cloud Functions Invoker + Cloud Run Invoker for supporting both 1st and 2nd gen functions):
https://console.cloud.google.com/iam-admin/serviceaccounts?project=parking-reminder-407014&supportedpurview=project

- parking-reminder-407014@appspot.gserviceaccount.com
- cloud-function@parking-reminder-407014.iam.gserviceaccount.com

### Invoking using CLI
```
curl -m 70 -X POST https://us-central1-parking-reminder-407014.cloudfunctions.net/sendEmail -H "Authorization: bearer $(gcloud auth print-identity-token)" -H "Content-Type: application/json" -d '{ "to_email": "luhcforgh@gmail.com", "to_name": "Johan added to queue manually", "from_name": "Myself"'}
```

## Creating Tasks

A task is used to invoke the cloud function with specific data, either immediately, or at a scheduled time.

### Using CLI

gcloud tasks create-http-task --queue=parking-reminder-task-queue --url=https://us-central1-parking-reminder-407014.cloudfunctions.net/sendEmail myCliTaskWithJson --method=POST --header=Content-Type:application/json --body-file=cloudfunctionbody.txt --oidc-service-account-email=cloud-function@parking-reminder-407014.iam.gserviceaccount.com 

### Using example frontend app on App Engine

This will not actually be used for our purposes, as this will be the NextJS app instead.

#### Running locally

You should be able to run the web app locally, as any NodeJS app, to play around with it. You may need to ensure that the service accounts are set up correctly though for the task to get created.

Note that you will have to open the index.html file as a local file - it isn't served by the Express app itself!

#### Deployment
First you have to deploy it from the app directory: `gcloud app deploy`
Open browser to the app: `gcloud app browse`
Or go directly to: https://parking-reminder-407014.ew.r.appspot.com/

This is using "cloud-function@parking-reminder-407014.iam.gserviceaccount.com" as the service account to create the task for the queue, as specified in the code.

https://console.cloud.google.com/appengine/services?serviceId=default&project=parking-reminder-407014&supportedpurview=project
# Using GCP Cloud Functions and Tasks To Send Email

## Preparations

```
gcloud auth application-default login
gcloud config set project parking-reminder-407014
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/application_default_credentials.json
export SENDGRID_API_KEY="YOUR_KEY_HERE" (production key)
export SENDGRID_SENDER_EMAIL="SENDER_EMAIL_HERE" (see [SendGrid setup](https://app.sendgrid.com/settings/sender_auth), needs to match)
```

## Creating Cloud Function

A serverless cloud function is essentially a single endpoint that will perform some logic. In this project, the goal is to send an email. We can create a new cloud function for the "real" parking app.

### Running locally

You can run the "serverless" server locally with `npm start` using Functions Framework, which will present the cloud function as a regular endpoint for you to play around with it. Be sure to set the appropriate environment variables beforehand.

Example of a call (note that the data being sent is out of date):
```
curl --location 'http://localhost:8080/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to_email": "YOUR EMAIL HERE",
    "to_name": "YOUR NAME HERE"
}'
```

### Deployment

Deploying overwrites the existing deployment, so if versioned functions are necessary, you will have to rename the function accordingly. This is generally not an issue for minor tweaks without changing the input data, but keep in mind that scheduled tasks may take several days before they are run, and will target whichever function was scheduled at the time of creation.
Email: 
```
gcloud functions deploy sendgridEmailScheduledReminder --gen2 --runtime nodejs20 --trigger-http  --no-allow-unauthenticated [--set-env-vars SENDGRID_API_KEY=<secret-redacted>,SENDGRID_SENDER_EMAIL=johanehrenfors@hotmail.com] --region=europe-west1
```
NOTE: The first time I deployed, I had to enable run.googleapis.com for the project (parking-reminder-407014) when prompted.

SMS:
```
gcloud functions deploy elksSmsScheduledReminder --gen2 --runtime nodejs20 --trigger-http  --no-allow-unauthenticated --region=europe-west1
```

You can find the function here afterwards: https://console.cloud.google.com/functions/details/europe-west1/sendgridEmailScheduledReminder?env=gen2&project=parking-reminder-407014

Cloud tasks queue for production:
https://console.cloud.google.com/cloudtasks/queue/europe-west1/parking-reminder-task-queue/tasks?project=parking-reminder-407014

The service accounts, which have sufficient rights to invoke the Cloud Function (roles: Cloud Functions Invoker + Cloud Run Invoker for supporting both 1st and 2nd gen functions):
https://console.cloud.google.com/iam-admin/serviceaccounts?project=parking-reminder-407014&supportedpurview=project

- parking-reminder-407014@appspot.gserviceaccount.com
- cloud-function@parking-reminder-407014.iam.gserviceaccount.com

### Invoking cloud function using CLI
To invoke the cloud function, you will need to be authenticated through GCP with a bearer token.

Email (not currently supported, need to pay):
```
curl -m 70 -X POST https://europe-west1-parking-reminder-407014.cloudfunctions.net/sendgridEmailScheduledReminder -H "Authorization: bearer $(gcloud auth print-identity-token)" -H "Content-Type: application/json" -d '{ "to_email": "example@gmail.com", "vehicle_nickname": "Volvo", "location": { "name": "Street 123", "lat": 12.3, "lng": 4.56 }, "move_by_timestamp": "2024-06-29T13:52:13Z" }'
```

SMS:
```
curl -m 70 -X POST https://europe-west1-parking-reminder-407014.cloudfunctions.net/elksSmsScheduledReminder -H "Authorization: bearer $(gcloud auth print-identity-token)" -H "Content-Type: application/json" -d '{ "phone_number": "+46737600282", "vehicle_nickname": "Volvo", "location": "ICA parkeringen", "timestamp": "2024-06-29T13:52:13Z" }'
```

## Creating Tasks

A task is used to invoke the cloud function with specific data, either immediately, or at a scheduled time. For an example of setting a scheduled time, you can look at how the web app in gcp-backend does this.

### Using CLI

```
gcloud tasks create-http-task --queue=parking-reminder-task-queue --url=https://europe-west1-parking-reminder-407014.cloudfunctions.net/sendgridEmailScheduledReminder myCliTaskWithJson --method=POST --header=Content-Type:application/json --body-file=cloudfunctionbody.txt --oidc-service-account-email=cloud-function@parking-reminder-407014.iam.gserviceaccount.com 
```

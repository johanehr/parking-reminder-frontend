# [Node.js Cloud Tasks sample for Google App Engine and Cloud Functions][tutorial-link]

This is the sample application for the
[Using Cloud Tasks to trigger Cloud Functions][tutorial-link] tutorial.

This tutorial shows how to create [Cloud Tasks][cloud-tasks] on
[Google App Engine Standard][gae-std] to trigger a [Cloud Function][cloud-func]
in order to send a postcard email.

## Application Architecture

* The App Engine application calls the Cloud Tasks API to add a scheduled task
to the queue.

* The queue processes tasks and sends requests to a Cloud Function.

* The Cloud Function calls the SendGrid API to send a postcard email.

[tutorial-link]: https://cloud.google.com/tasks/docs/tutorial-gcf
[cloud-tasks]: https://cloud.google.com/tasks/docs/
[gae-std]: https://cloud.google.com/appengine/docs/standard/nodejs/
[cloud-func]: https://cloud.google.com/functions/

## My notes when trying to get this to work:

Guide: https://cloud.google.com/tasks/docs/tutorial-gcf

I set the NodeJS version to 20.


### Running the Cloud Function tests
gcloud auth application-default login
gcloud config set project parking-reminder-407014

(Attempt to address "Error: Unable to detect a Project Id in the current environment.", but it didn't solve it)
export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/application_default_credentials.json
export SENDGRID_API_KEY="YOUR_KEY_HERE"

### Running the App tests
This did not work either... The Promise times out.

### Commands

Invoking the cloud function directly:
```
curl -m 70 -X POST https://us-central1-parking-reminder-407014.cloudfunctions.net/sendEmail -H "Authorization: bearer $(gcloud auth print-identity-token)" -H "Content-Type: application/json" -d '{ "to_email": "luhcforgh@gmail.com", "to_name": "Johan added to queue manually", "from_name": "Myself"'} 
```

gcloud functions deploy sendEmail --runtime nodejs20 --trigger-http   --no-allow-unauthenticated   --set-env-vars SENDGRID_API_KEY=<secret-redacted> \


https://console.cloud.google.com/functions/details/us-central1/sendEmail?env=gen1&project=parking-reminder-407014

https://console.cloud.google.com/cloudtasks/queue/europe-west1/parking-reminder-task-queue/tasks?project=parking-reminder-407014

https://console.cloud.google.com/iam-admin/serviceaccounts?project=parking-reminder-407014&supportedpurview=project

I did not manage to get the function to invoke properly, getting 403 from the task queue. I did manage to get a 500 where the req.body wasn't including the expected contents when adding a manual task (screenshot in Google Sheet)


{
    "to_name": "Johan (Gmail)",
    "from_name": "Johan (testing)",
    "to_email": "luhcforgh@gmail.com"
}

Since https://app.sendgrid.com/settings/sender_auth has johanehrenfors@hotmail.com as a verified single sender, I modified the sender in the code. The guide doesn't mention this at all, but it seems like we were getting a forbidden from SendGrid itself in the cloud function.

It worked when invoking from the terminal (and testing functionality in Google Cloud console):

curl -m 70 -X POST https://us-central1-parking-reminder-407014.cloudfunctions.net/sendEmail \
-H "Authorization: bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{
    "to_name": "Johan (Gmail)",
    "from_name": "Johan (terminal)",
    "to_email": "luhcforgh@gmail.com"
}'

I tried removing the allAuthenticatedUsers from the Cloud Function permissions tab, and it still works!

Going through the app works too: https://parking-reminder-407014.ew.r.appspot.com/
This is using "cloud-function@parking-reminder-407014.iam.gserviceaccount.com" as the service account.

For some reason I wasn't able to get it to work by clicking the "Create HTTP task" button on this page: https://console.cloud.google.com/cloudtasks/queue/europe-west1/parking-reminder-task-queue/tasks?project=parking-reminder-407014
The issue seemed to be that the body wasn't received properly.

When adding a task to the queue from CLI, as follows, it worked! The issue was the missing Content-Type header.

gcloud tasks create-http-task --queue=parking-reminder-task-queue --url=https://us-central1-parking-reminder-407014.cloudfunctions.net/sendEmail myCliTaskWithJson --method=POST --header=Content-Type:application/json --body-file=cloudfunctionbody.txt --oidc-service-account-email=cloud-function@parking-reminder-407014.iam.gserviceaccount.com 

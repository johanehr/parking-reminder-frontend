'use strict';

// [START cloud_tasks_func]
const sendgrid = require('@sendgrid/mail');

/**
 * Responds to an HTTP request from Cloud Tasks and sends an email using data
 * from the request body.
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request payload. // TODO: Modify this according to actual email contents
 * @param {string} req.body.to_email Email address of the recipient.
 * @param {string} req.body.to_name Name of the recipient.
 * @param {object} res Cloud Function response context.
 */
exports.sendgridEmailScheduledReminder = async (req, res) => {
  // Get the SendGrid API key from the environment variable.
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    const error = new Error(
      'SENDGRID_API_KEY was not provided as environment variable.'
    );
    error.code = 401;
    throw error;
  }
  sendgrid.setApiKey(key);

  const sender_email = process.env.SENDGRID_SENDER_EMAIL // This should match the SendGrid verified senders, if set up that way
  if (!sender_email) {
    const error = new Error(
      'SENDGRID_SENDER_EMAIL was not provided as environment variable.'
    );
    error.code = 401;
    throw error;
  }

  // Get the body from the Cloud Task request.
  const {to_email, to_name} = req.body;

  if (!to_email) {
    const error = new Error('Email address not provided.');
    error.code = 400;
    throw error;
  } else if (!to_name) {
    const error = new Error('Recipient name not provided.');
    error.code = 400;
    throw error;
  }

  // Construct the email request. 
  const msg = {
    to: to_email,
    from: sender_email, 
    subject: 'Remember to move your car!',
    html: reminderHTML(to_name),
  };
  console.log("Message to send via SendGrid:");
  console.log(msg);

  try {
    await sendgrid.send(msg);
    // Send OK to Cloud Task queue to delete task.
    res.status(200).send('Reminder successfully sent!');
  } catch (error) {
    console.log(error);
    // Any status code other than 2xx or 503 will trigger the task to retry.
    res.status(error.code).send(error.message);
  }
};
// [END cloud_tasks_func]

// Function creates an HTML postcard with message.
const reminderHTML = function (to_name) {
  return `<html>
  <head>
    <style>
      .reminder {
        width: 600px;
        height: 400px;
        background: #4285F4;
        text-align: center;
      }

      .reminder-text {
        font-family: Arial, sans-serif;
        font-size: 60px;
        font-weight: bold;
        text-transform: uppercase;
        color: #FFF;
        padding: 40px 0px;
      }

      .reminder-names {
        font-family: Monaco, monospace;
        font-size: 30px;
        text-align: left;
        color: #FFF;
        margin: 15px;
        padding-top: 5px;
        overflow: hidden;
        white-space: nowrap;
      }

      .reminder-footer {
        font-family: Monaco, monospace;
        font-size: 14px;
        color: #FFF;
        padding-top: 50px;
      }
    </style>
  </head>
  <body>
    <div class="reminder">
      <div class="reminder-names">
        Dear ${to_name},
      </div>
      <div class="reminder-text">
          It is time to move your car!
      </div>
      <div class="reminder-footer">
        Scheduled reminder sent by parkering.johanehrenfors.se
      </div>
      </div>
  </body>
</html>`;
};

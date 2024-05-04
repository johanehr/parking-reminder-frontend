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
  const {to_email, to_name, vehicle_nickname, location_data, } = req.body;

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
    subject: `Upcoming Cleaning Time Where You Have Parked ${vehicle_nickname ?? 'Your Car'}`,
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
      body {
        background: #000000;
      }
      
      .reminder {
        width: 80%;
        margin: auto;
        height: 100vh;
        text-align: center;
      }

      .reminder-header {
        font-family: Arial, sans-serif;;
        font-size: 2.0em;
        text-align: left;
        font-weight: bold;
        color: #FFF;
        overflow: hidden;
        white-space: nowrap;
      }

      .reminder-text {
        font-family: Arial, sans-serif;
        font-size: 1.5em;
        text-align: left;
        color: #FFF;
        padding: 30px 0px;
      }

      .reminder-text ul {
        text-align: left;
      }

      .reminder-footer {
        font-family: Arial, sans-serif;
        font-size: 1.0em;
        color: #FFF;
      }

      a {
        color: #FFF
      }
    </style>
  </head>
  <body>
    <div class="reminder">
      <div class="reminder-header">
        Hello ${to_name ?? 'dear user'},
      </div>
      <div class="reminder-text">
        <p>Just a friendly reminder that the scheduled cleaning time for your parked car at <a href="https://www.google.com/maps/search/?api=1&query=${location_data.lat},${location_data.lng}">${location_data.name}</a> is approaching:</p>
        <ul>
          <li><b>Last time to move:</b> ${location_data.timestamp}</li>
          <li><b>Car nickname:</b> ${vehicle_nickname ?? 'Not specified'}</li>
        </ul>

        <p>Please ensure your car is moved before the scheduled cleaning starts to avoid any parking tickets.</p>

        <h2>Need a New Spot?</h2>
        <p>
          If you're looking for a new place to park, our app can help you find the best available spots nearby.
          Simply open <a href="https://parkering.johanehrenfors.se">the app</a> and check the map for current parking information.
        </p>

        <h3>Thank you for using our app!</h3>
        <p>Best wishes,<br><i>The Boendeparkering team</i></p>


      </div>
      <div class="reminder-footer">
        <p>
          You have received this email because you've subscribed to receive reminders from <a href="https://parkering.johanehrenfors.se">Boendeparkering</a>.
          If you did not request this reminder, email us at <a href="mailto:johanehrenfors@hotmail.com">johanehrenfors@hotmail.com, so that we can blacklist this email.</a>
        </p>
      </div>
      </div>
  </body>
</html>`;
};

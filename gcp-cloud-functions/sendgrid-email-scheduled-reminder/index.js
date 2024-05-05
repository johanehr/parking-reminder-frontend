'use strict';

// [START cloud_tasks_func]
const sendgrid = require('@sendgrid/mail');

/**
 * Responds to an HTTP request from Cloud Tasks and sends an email using data
 * from the request body.
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request payload.
 * @param {string} req.body.to_email Email address of the recipient.
 * @param {string} req.body.vehicle_nickname Optional nickname/identifier for the vehicle
 * @param {string} req.body.location.name Description of parking location
 * @param {string} req.body.location.lat Latitude of parking location
 * @param {string} req.body.location.lng Longitude of parking location
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
  const {to_email, vehicle_nickname, location, move_by_timestamp } = req.body;

  if (!to_email) {
    const error = new Error('Email address not provided.');
    error.code = 400;
    throw error;
  } else if (!location || !location.name || !location.lat || !location.lng) {
    const error = new Error('Location data not provided.');
    error.code = 400;
    throw error;
  } else if (!move_by_timestamp) {
    const error = new Error('Timestamp not provided.');
    error.code = 400;
    throw error;
  }

  // Construct the email request. 
  const msg = {
    to: to_email,
    from: sender_email, 
    subject: `Reminder: Time To Move ${vehicle_nickname ?? 'Your Car'}`,
    html: reminderHTML(vehicle_nickname, location, move_by_timestamp),
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
const reminderHTML = function (vehicle_nickname, location, move_by_timestamp) {
  return `<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
    <style>
      body {
        background: white;
      }
      
      .reminder {
        width: 80%;
        margin: auto;
        height: 100vh;
        text-align: center;
        color: #484848;
      }

      .reminder-header {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 2.0em;
        text-align: left;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
      }

      .reminder-text {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 1.5em;
        text-align: left;
        padding: 30px 0px;
      }

      .reminder-text ul {
        text-align: left;
      }

      .reminder-footer {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 1.0em;
        font-style: italic;
      }

      a {
        color: #484848
        text-decoration: #484848 wavy underline;
      }
    </style>
  </head>
  <body>
    <div class="reminder">
      <div class="reminder-header">
        <h1>Hello!</h1>
      </div>
      <div class="reminder-text">
        <p>Just a friendly reminder that the scheduled cleaning time for your parked car at <a href="https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}">${location.name}</a> is approaching:</p>
        <ul>
          <li><b>Last time to move:</b> ${move_by_timestamp}</li>
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
          If you did not request this reminder, email us at <a href="mailto:johanehrenfors@hotmail.com">johanehrenfors@hotmail.com</a>, so that we can blacklist this email.
        </p>
      </div>
      </div>
  </body>
</html>`;
};

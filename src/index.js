const { Console } = require("console");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.triggerForSendMail = (event, context) => {

  if (event.data) {

    const message = Buffer.from(event.data, 'base64').toString()

    sendEmail(message)
    console.log(message)
  }

  console.log(`event : ${JSON.stringify(event)}, context : ${JSON.stringify(context)}`)
};

/**
 * Sends an email using Nodemailer and data from the request
 * and environment variables.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
function sendEmail(dataString) {

  const nodeMailer = require("nodemailer")
  const nodeMailerSendgrid = require("nodemailer-sendgrid")

  const transport = nodeMailer.createTransport(
    nodeMailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY
    })
  )

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    bcc: process.env.MAIL_BCC,
    subject: "GKE deploy announcement via Pub/Sub",
    text: dataString,
  }

  console.log(JSON.stringify(mailOptions))

  transport
    .sendMail(mailOptions)
    .then(() => {
      console.log("Mail sent")
    })
    .catch((e) => {
      console.log(`Mail send failed, exception:${e.toString()}`)
    })
}
const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

async function sendNewsletterToAll(subject, text) {
  const subscribers = await Newsletter.find({});
  const emails = subscribers.map(sub => sub.email);

  if (emails.length === 0) return;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails, // array of emails
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendNewsletterToAll; 
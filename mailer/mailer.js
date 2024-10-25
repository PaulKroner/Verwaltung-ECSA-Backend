// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'gilberto.lindgren70@ethereal.email',
    pass: 'KSZ2TqeZfKMqPuFCUp'
  }
});

const sendEmail = async (to, subject, htmlContent, attachments, filename) => {
  const mailOptions = {
    from: 'gilberto.lindgren70@ethereal.email',
    to,
    subject,
    html: htmlContent,
    attachments: [
      {
        filename: filename,  // Use the filename parameter
        content: attachments, // Use the CSV data as attachment content
      },
    ],
  };

  return transporter.sendMail(mailOptions).then((info) => {
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info)); // For testing email
  });
};

module.exports = { sendEmail };
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

const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: 'gilberto.lindgren70@ethereal.email',
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions).then(info => {
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
  });
};

module.exports = { sendEmail };
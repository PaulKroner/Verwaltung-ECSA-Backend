const { sendEmail } = require('./mailer/mailer');

// send email request for Führungszeugnis when new Employee is inserted
const sendEmailRequestFZ = async (req, res) => {
  const { email, name } = req.body;
  const message = `
    <h1>Führungszeugnis übermitteln</h1>
    <p>Hallo ${name},</p>
    <div>Schicken Sie ihr Führungszeugnis bitte an diese E-Mail-Adresse: -EMAIL einfügen--</div>
  `;
  try {
    await sendEmail(email, 'Führungszeugnis übermitteln', message);
    // Send success response
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Send error response
    console.error("Error sending email:", error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

module.exports = sendEmailRequestFZ ;
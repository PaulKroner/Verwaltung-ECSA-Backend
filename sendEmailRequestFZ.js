const { sendEmail } = require('./mailer/mailer');
const path = require('path'); // To handle file paths
const fs = require('fs'); // For reading the file

// send email request for Führungszeugnis when new Employee is inserted
const sendEmailRequestFZ = async (req, res) => {
  const { email, name } = req.body;
  const message = `
    <h1>Führungszeugnis übermitteln</h1>
    <p>Hallo ${name},</p>
    <div>Schicken Sie ihr Führungszeugnis bitte an diese E-Mail-Adresse: -EMAIL einfügen--</div>
  `;

        // Read the PDF file as a buffer
        const pdfPath = path.join(__dirname, '/assets/Aufforderung Polizeiliches Führungszeugnis 2023.pdf');
        const pdfBuffer = fs.readFileSync(pdfPath);

        console.log("test2")

      console.log(pdfPath);
      console.log(pdfBuffer);

      console.log("test2")
  try {
    await sendEmail(email, 'Führungszeugnis übermitteln', message, pdfBuffer, 'Aufforderung Polizeiliches Führungszeugnis.pdf');
    // Send success response
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Send error response
    console.error("Error sending email:", error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

module.exports = sendEmailRequestFZ ;
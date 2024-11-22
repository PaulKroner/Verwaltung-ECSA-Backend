const { sendEmail } = require('./mailer/mailer');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const path = require('path'); // To handle file paths
const fs = require('fs'); // For reading the file

const expiryMailFZ = async () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  try {
    // Retrieve records where fz_abgelaufen < today
    const expiredCertificates = await prisma.employees.findMany({
      where: {
        fz_abgelaufen: {
          lt: new Date(today), // Use Prisma's `lt` (less than) operator
        },
      },
    });

    // Iterate through the expired certificates
    for (const employee of expiredCertificates) {
      console.error(employee);
      try {
        // Read the PDF file as a buffer
        const pdfPath = path.join(__dirname, '/assets/Aufforderung Polizeiliches Führungszeugnis 2023.pdf');
        const pdfBuffer = fs.readFileSync(pdfPath);
        const email = employee.email;
        const message = `
          <h1>Führungszeugnis abgelaufen</h1>
          <p>Hallo ${employee.name},</p>
          <div>Ihr Führungszeugnis ist abgelaufen. Im Anhang finden Sie die PDF.</div>
          <div>Schicken Sie die ausgefüllte PDF an --EMAIL einfügen--</div>
        `;
        await sendEmail(email, 'Führungszeugnis abgelaufen', message, pdfBuffer, 'Aufforderung Polizeiliches Führungszeugnis.pdf');
        console.log(`Email sent to ${email}`);
      } catch (error) {
        console.error(`Failed to send email to ${employee.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error checking expired certificates:', error.message);
    console.error(error.stack);
  }
};

const expiryMailUS = async () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  try {
    // Retrieve records where us_abgelaufen < today
    const expiredTrainings = await prisma.employees.findMany({
      where: {
        us_abgelaufen: {
          lt: new Date(today), // Use Prisma's `lt` (less than) operator
        },
      },
    });

    // Iterate through the expired trainings
    for (const employee of expiredTrainings) {
      console.error(employee);
      try {
        const email = employee.email;
        const message = `
          <h1>Upgradeschulung abgelaufen</h1>
          <p>Hallo ${employee.name},</p>
          <div>Ihre Upgradeschulung ist abgelaufen. Im Anhang finden Sie die PDF.</div>
          <div>Schicken Sie die ausgefüllte PDF an --EMAIL einfügen--</div>
        `;
        await sendEmail(email, 'Upgradeschulung abgelaufen', message);
        console.log(`Email sent to ${email}`);
      } catch (error) {
        console.error(`Failed to send email to ${employee.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error checking expired trainings:', error.message);
    console.error(error.stack);
  }
};

module.exports = {
  expiryMailFZ, expiryMailUS
};
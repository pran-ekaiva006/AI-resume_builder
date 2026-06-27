const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;
  
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email for local testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  const mailOptions = {
    from: '"AI Resume Builder" <noreply@airesumebuilder.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  const info = await transporter.sendMail(mailOptions);
  
  if (process.env.NODE_ENV !== "production") console.log('Message sent: %s', info.messageId);
  if (!process.env.SMTP_HOST) {
    if (process.env.NODE_ENV !== "production") console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;

const nodemailer = require("nodemailer");

exports.sendEmail = (to, subject, message, callback) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_TRANSPORTER,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    callback({ error, info });
  });
};

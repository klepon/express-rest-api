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

  if(!process.env.EMAIL_PASSWORD) {
    console.log("======= debug mailer mailOptions: ", mailOptions);
    callback({ error: null });
    // callback({ error: new Error() });
    return;
  }

  transporter.sendMail(mailOptions, (error) => {
    callback({ error });
  });
};

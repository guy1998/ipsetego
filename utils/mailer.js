const nodemailer = require('nodemailer');
require('dotenv').config()


const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.de',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_PASS,
  },
});

async function sendOtp(to, otp) {
  try {
    const info = await transporter.sendMail({
      from: 'service@ipsetego.com',
      to,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background-color: #f9f9f9;">
          <div style="max-width: 400px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">🔑 Your OTP Code</h2>
            <p style="color: #555; font-size: 15px;">Use the code below to complete your verification. It will expire in 10 minutes.</p>
            <div style="margin: 20px 0; padding: 15px; border: 2px dashed #4f46e5; border-radius: 8px; display: inline-block; background-color: #f3f4f6;">
              <span style="font-size: 24px; font-weight: bold; color: #111; letter-spacing: 4px;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
          </div>
        </div>
      `
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
}

async function sendContactEmail(to, fromName, fromSurname, fromEmail, subject, content) {
  try {
    const info = await transporter.sendMail({
      from: 'service@ipsetego.com',
      to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
              You have received a new message from <strong>${fromName} ${fromSurname}</strong> (<a href="mailto:${fromEmail}" style="color: #4f46e5;">${fromEmail}</a>) via your ipsetego portfolio.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <div style="padding: 16px; background-color: #f3f4f6; border-radius: 8px; color: #111; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${content}</div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #888; font-size: 12px;">This message was sent through <strong>ipsetego</strong>. To reply, contact <a href="mailto:${fromEmail}" style="color: #4f46e5;">${fromEmail}</a> directly.</p>
          </div>
        </div>
      `
    });

    console.log("Contact email sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending contact email:", err);
    return false;
  }
}

module.exports = {
  sendOtp,
  sendContactEmail
}
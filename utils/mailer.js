const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: "mail.ipsetego.com",
  port: 465, 
  secure: true,
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendOtp(to, otp) {
  try {
    const info = await transporter.sendMail({
      from: '"Ipsetego" service@ipsetego.com',
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

module.exports = {
    sendOtp
}
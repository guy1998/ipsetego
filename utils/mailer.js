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

async function sendAdminAlert(adminEmails, unauthorizedEmail) {
  const emailList = Array.isArray(adminEmails) ? adminEmails.join(', ') : adminEmails;
  try {
    await transporter.sendMail({
      from: 'service@ipsetego.com',
      to: emailList,
      subject: '⚠️ Unauthorized Admin Login Attempt',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border-left: 5px solid #dc2626;">
            <h2 style="color: #dc2626; margin-top: 0;">⚠️ Unauthorized Admin Access Attempt</h2>
            <p style="color: #555; font-size: 15px;">
              An unauthorized login attempt was made on the <strong>ipsetego Admin Dashboard</strong>.
            </p>
            <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
              <p style="margin: 0; color: #991b1b; font-size: 14px;"><strong>Attempted Email:</strong> ${unauthorizedEmail}</p>
              <p style="margin: 8px 0 0; color: #991b1b; font-size: 14px;"><strong>Time:</strong> ${new Date().toUTCString()}</p>
            </div>
            <p style="color: #888; font-size: 12px; margin-bottom: 0;">This email was sent automatically by the ipsetego security system.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (err) {
    console.error('Error sending admin alert email:', err);
    return false;
  }
}

async function sendDataRequestEmail(to, downloadLink) {
  try {
    const info = await transporter.sendMail({
      from: 'service@ipsetego.com',
      to,
      subject: 'Your Data Export — ipsetego',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Your Data Export is Ready</h2>
            <p style="color: #555; font-size: 15px;">
              You requested an export of all data associated with your ipsetego account. Click the button below to download a ZIP archive containing your full profile, projects, experience, certifications, profile picture, and CV.
            </p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${downloadLink}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: bold;">
                Download My Data
              </a>
            </div>
            <p style="color: #888; font-size: 13px;">This link is valid for 24 hours. If you did not request this export, you can safely ignore this email.</p>
          </div>
        </div>
      `
    });
    console.log("Data request email sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending data request email:", err);
    return false;
  }
}

module.exports = {
  sendOtp,
  sendContactEmail,
  sendAdminAlert,
  sendDataRequestEmail
}
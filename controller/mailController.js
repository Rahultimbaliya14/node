const nodemailer = require("nodemailer"); 
const mongoose = require("mongoose");
const emailModel = require('../models/email');

exports.sendMail = async (req, res) => {
  const { email } = req.body;
  const portfolioLink = process.env.portfolioLink;
  const resumeLink = process.env.resumeLink;
  const host = process.env.emailHost || "smtp.gmail.com";
  const port = process.env.emailPort || 587; 
  const secure = process.env.emailSecure === "true"; // make sure it's a boolean
  const emailUsername = process.env.emailUser;
  const emailPass = process.env.emailPass;

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: emailUsername,
        pass: emailPass,
      },
    });

    const info = await transporter.sendMail({
      from: emailUsername,
      to: email,
      subject: "Sharing My Profile - Rahul P Timbaliya",
      text: `
Hello,

I hope you're doing well.

I am Rahul P Timbaliya, and I'm sharing my profile and resume for your reference.

Portfolio: ${portfolioLink}  
Resume: ${resumeLink}

Thank you for taking the time to view it.

Best regards,  
Rahul P Timbaliya`,
      html: `
<p>Hello,</p>
<p>I hope you're doing well.</p>
<p>
  I am <strong>Rahul P Timbaliya</strong>, and I'm sharing my profile and resume for your reference.
</p>
<ul>
  <li><strong>Portfolio:</strong> <a href="${portfolioLink}" target="_blank">View Portfolio</a></li>
  <li><strong>Resume:</strong> <a href="${resumeLink}" target="_blank">View Resume</a></li>
</ul>
<p>Thank you for taking the time to view it.</p>
<p>Best regards,<br>Rahul P Timbaliya</p>
`,
      attachments: [
        {
          filename: 'Rahul P Timbaliya Resume.pdf',
          path: resumeLink,
        }
      ],
    });

    await saveEmailToDB(email);
    console.log("Message sent:", info.messageId);
    res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

exports.createEmail = async (req, res) => {
  try {
    const newEmail = await saveEmailToDB(req.body.email);
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getEmails = async (req, res) => {
  try {
    const emails = await emailModel.find().sort({ createdAt: -1 });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmail = async (req, res) => {
  const { id } = req.params; 
  try {
    const deletedEmail = await emailModel.findByIdAndDelete(id);
    if (!deletedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
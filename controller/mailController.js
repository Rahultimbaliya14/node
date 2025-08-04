const nodemailer = require("nodemailer"); 

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

    console.log("Message sent:", info.messageId);
    res.status(200).json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};
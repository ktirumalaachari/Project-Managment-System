import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Management",
      link: "https://ProjectManagement.com",
    },
  });

  const emailtextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailhtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USERNAME,
      pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
  });

  const mail ={
    from: "[EMAIL_ADDRESS]",
    to: options.email,
    subject: options.subject,
    text: emailtextual,
    html: emailhtml,
  };

  try {
    await transporter.sendMail(mail);
    return true;
  } catch (error) {
    console.log("Email Service failed silently. Make sure that you have provided your Email Trap credentials in the .env file.", error);
    console.error("Error: ", error)
    return false;
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our platform! Verify your email to get started.",
      action: {
        instructions: "Click the button below to verify your email address.",
        button: {
          color: "#4c7211ff",
          text: "Verify Email",
          link: verificationUrl,
        },
      },
      outro: "If you did not create this account, please ignore this email.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "You received this email because you requested a password reset.",
      action: {
        instructions: "To Reset your password, click the button below:",
        button: {
          color: "#8a0606ff",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'll be happy to help you!",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };

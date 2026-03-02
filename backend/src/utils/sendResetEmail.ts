import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendResetEmail = async (email: string, resetUrl: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    html: `<p>Click below to reset password:</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  });
};

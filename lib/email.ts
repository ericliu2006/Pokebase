import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new (Mailgun as any)(formData);

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  if (!process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_API_KEY) {
    console.error('Mailgun credentials not configured');
    throw new Error('Email service is not configured');
  }

  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `PokeBase <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject,
      text,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  return sendEmail({
    to: email,
    subject: 'Your PokeBase Verification Code',
    text: `Your verification code is: ${token}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h1 style="color: #ef4444;">Welcome to PokeBase!</h1>
        <p>Please use the following verification code to complete your registration:</p>
        
        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          text-align: center;
          margin: 20px 0;
          padding: 15px;
          background-color: #f9fafb;
          border-radius: 6px;
          border: 1px dashed #d1d5db;
        ">
          ${token}
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          This code will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

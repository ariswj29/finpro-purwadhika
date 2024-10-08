import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export const sendResetPassword = async (
  toEmail: string,
  token: string,
  name: string,
) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.NODEMAILER_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token || '',
      },
    });

    const domain = process.env.PUBLIC_APP_URL;
    const verificationLink = `${domain}/auth/reset-password/confirm?token=${token}`;
    console.log(verificationLink, 'verlink');

    const mailOptions = {
      from: "'Groceria' <info@groceria.com>",
      to: toEmail,
      subject: 'Reset Password - Groceria',
      text: `Please reset your password`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Hello, ${name}</h2>
        <p>Sorry to hear you’re having trouble logging into Groceria. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now.:</p>
        <p style="text-align: center;">
            <a href="${verificationLink}" style="
            background-color: #1abc9c;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;">
            Reset your password
            </a>
        </p>
        <p>If the button doesn't work, you can also click on the link below:</p>
        <p style="text-align: center;">
            <a href="${verificationLink}" style="color: #3498db;">${verificationLink}</a>
        </p>
        <p>Thank you,<br/>The Groceria Team</p>
        </div>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

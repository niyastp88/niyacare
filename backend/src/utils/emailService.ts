import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER?.trim();
const emailPassword = process.env.EMAIL_PASSWORD?.trim();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

export const sendPasswordResetOtp = async (
  email: string,
  otp: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `"NiyaCare" <${emailUser}>`,
    to: email,
    subject: 'NiyaCare - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0F9D9A;">
          NiyaCare
        </h2>

        <p>
          You requested to reset your NiyaCare account password.
        </p>

        <p>Your OTP is:</p>

        <h1
          style="
            letter-spacing: 6px;
            color: #0F766E;
          "
        >
          ${otp}
        </h1>

        <p>
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <br />

        <p>
          Regards,<br />
          <strong>NiyaCare Team</strong>
        </p>
      </div>
    `,
  });
};
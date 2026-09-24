import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { sendPasswordResetOtp } from '../utils/emailService';

const generateToken = (
  userId: string,
  role: 'user' | 'admin'
): string => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d',
    }
  );
};

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: 'All fields are required',
      });
      return;
    }

    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  res.status(400).json({
    message:
      'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character',
  });
  return;
}

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(400).json({
        message: 'User already exists',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    res.status(201).json({
      message: 'Registration successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required',
      });
      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken(
      user._id.toString(),
      user.role
    );

    res.status(200).json({
      message: 'Login successful',

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {email} = req.body;

    if (!email) {
      res.status(400).json({
        message: 'Email is required',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      res.status(404).json({
        message: 'No account found with this email',
      });
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // OTP valid for 10 minutes
    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    user.resetPasswordVerified = false;

    await user.save();

    await sendPasswordResetOtp(
      normalizedEmail,
      otp,
    );

    res.status(200).json({
      message: 'Password reset OTP sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    res.status(500).json({
      message: 'Failed to send password reset OTP',
    });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {email, otp} = req.body;

    if (!email || !otp) {
      res.status(400).json({
        message: 'Email and OTP are required',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    if (
      !user.resetPasswordOtp ||
      !user.resetPasswordOtpExpires
    ) {
      res.status(400).json({
        message: 'No OTP request found',
      });
      return;
    }

    if (
      user.resetPasswordOtpExpires.getTime() < Date.now()
    ) {
      res.status(400).json({
        message: 'OTP has expired',
      });
      return;
    }

    if (user.resetPasswordOtp !== otp) {
  res.status(400).json({
    message: 'Invalid OTP',
  });
  return;
}

user.resetPasswordVerified = true;
await user.save();

res.status(200).json({
  message: 'OTP verified successfully',
});
  } catch (error) {
    console.error('Verify OTP error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {email, newPassword} = req.body;

    if (!email || !newPassword) {
      res.status(400).json({
        message: 'Email and new password are required',
      });
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    if (!user.resetPasswordVerified) {
  res.status(400).json({
    message: 'Please verify OTP first',
  });
  return;
}

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    );

    user.password = hashedPassword;

user.resetPasswordOtp = undefined;
user.resetPasswordOtpExpires = undefined;
user.resetPasswordVerified = false;

await user.save();

    res.status(200).json({
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};
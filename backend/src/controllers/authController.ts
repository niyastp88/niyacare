import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';

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

    if (password.length < 6) {
      res.status(400).json({
        message: 'Password must be at least 6 characters',
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
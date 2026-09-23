import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import connectDB from '../config/db';
import User from '../models/User';

dotenv.config();

const createAdmin = async (): Promise<void> => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        'ADMIN_EMAIL and ADMIN_PASSWORD are required in .env'
      );
      process.exit(1);
    }

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: 'NiyaCare Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully');
    console.log(`Email: ${adminEmail}`);

    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error);
    process.exit(1);
  }
};

createAdmin();
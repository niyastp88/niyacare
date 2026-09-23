import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './src/config/db';
import authRoutes from './src/routes/authRoutes';
import doctorRoutes from './src/routes/doctorRoutes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'NiyaCare API is running',
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
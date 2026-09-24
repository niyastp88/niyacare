import { Response } from 'express';

import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const totalDoctors = await Doctor.countDocuments();

    const totalAppointments = await Appointment.countDocuments();

    const pendingAppointments = await Appointment.countDocuments({
      status: 'pending',
    });

    const completedAppointments = await Appointment.countDocuments({
      status: 'completed',
    });

    res.status(200).json({
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};
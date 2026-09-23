import { Response } from 'express';

import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import { AuthRequest } from '../middleware/authMiddleware';
import { generateSlots } from '../utils/slotUtils';

export const createAppointment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Authentication required',
      });
      return;
    }

    const { doctorId, date, slot } = req.body;

    // Validate required fields
    if (!doctorId || !date || !slot) {
      res.status(400).json({
        message: 'Doctor, date and slot are required',
      });
      return;
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found',
      });
      return;
    }

    // Get weekday from selected date
    const selectedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      res.status(400).json({
        message: 'Invalid date',
      });
      return;
    }

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const selectedDay = dayNames[selectedDate.getDay()];

    // Check doctor availability on selected day
    if (!doctor.availableDays.includes(selectedDay)) {
      res.status(400).json({
        message: `Doctor is not available on ${selectedDay}`,
      });
      return;
    }

    // Generate doctor's slots
    const slots = generateSlots(
      doctor.startTime,
      doctor.dailyTokens
    );

    // Check whether selected slot is valid
    const slotIndex = slots.indexOf(slot);

    if (slotIndex === -1) {
      res.status(400).json({
        message: 'Invalid slot for this doctor',
      });
      return;
    }

    const tokenNumber = slotIndex + 1;

    // Check whether slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      slot,
      status: {
        $in: ['pending', 'confirmed'],
      },
    });

    if (existingAppointment) {
      res.status(409).json({
        message: 'This slot is already booked',
      });
      return;
    }

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user.userId,
      doctor: doctorId,
      date,
      slot,
      tokenNumber,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getMyAppointments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Authentication required',
      });
      return;
    }

    const appointments = await Appointment.find({
      user: req.user.userId,
    })
      .populate(
        'doctor',
        'name specialization qualification experience consultationFee image'
      )
      .sort({ date: 1, slot: 1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error('Get my appointments error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getAllAppointments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate(
        'doctor',
        'name specialization qualification consultationFee'
      )
      .sort({ date: 1, slot: 1 });

    res.status(200).json({
      appointments,
    });
  } catch (error) {
    console.error('Get all appointments error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'confirmed',
      'cancelled',
      'completed',
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        message: 'Invalid appointment status',
      });
      return;
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({
        message: 'Appointment not found',
      });
      return;
    }

    // Pending → Confirmed / Cancelled
    if (appointment.status === 'pending') {
      if (status !== 'confirmed' && status !== 'cancelled') {
        res.status(400).json({
          message: 'Pending appointment can only be confirmed or cancelled',
        });
        return;
      }
    }

    // Confirmed → Completed
    if (appointment.status === 'confirmed') {
      if (status !== 'completed') {
        res.status(400).json({
          message: 'Confirmed appointment can only be completed',
        });
        return;
      }
    }

    // Cancelled appointments cannot be changed
    if (appointment.status === 'cancelled') {
      res.status(400).json({
        message: 'Cancelled appointment cannot be updated',
      });
      return;
    }

    // Completed appointments cannot be changed
    if (appointment.status === 'completed') {
      res.status(400).json({
        message: 'Completed appointment cannot be updated',
      });
      return;
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error('Update appointment status error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};
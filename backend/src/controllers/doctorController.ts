import { Request, Response } from 'express';

import Doctor from '../models/Doctor';

export const createDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      specialization,
      qualification,
      experience,
      consultationFee,
      image,
      availableDays,
      startTime,
      dailyTokens,
    } = req.body;

    if (
      !name ||
      !specialization ||
      !qualification ||
      experience === undefined ||
      consultationFee === undefined ||
      !availableDays ||
      !startTime ||
      dailyTokens === undefined
    ) {
      res.status(400).json({
        message: 'All required fields are required',
      });
      return;
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      qualification,
      experience,
      consultationFee,
      image: image || '',
      availableDays,
      startTime,
      dailyTokens,
    });

    res.status(201).json({
      message: 'Doctor created successfully',
      doctor,
    });
  } catch (error) {
    console.error('Create doctor error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getDoctors = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctors = await Doctor.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getDoctorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found',
      });
      return;
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error('Get doctor error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const updateDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Doctor updated successfully',
      doctor,
    });
  } catch (error) {
    console.error('Update doctor error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const deleteDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndDelete(
      req.params.id
    );

    if (!doctor) {
      res.status(404).json({
        message: 'Doctor not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    console.error('Delete doctor error:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};
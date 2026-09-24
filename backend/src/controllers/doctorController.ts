import { Request, Response } from "express";

import Doctor from "../models/Doctor";

// Calculate maximum tokens from start time until midnight
const getMaxTokens = (startTime: string): number => {
  const [hours, minutes] = startTime.split(":").map(Number);

  const startMinutes = hours * 60 + minutes;
  const minutesUntilMidnight = 24 * 60 - startMinutes;

  return Math.floor(minutesUntilMidnight / 5);
};

export const createDoctor = async (
  req: Request,
  res: Response,
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
        message: "All required fields are required",
      });
      return;
    }

    // Validate start time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime)) {
      res.status(400).json({
        message: "Invalid start time. Use HH:mm format",
      });
      return;
    }

    // Calculate maximum allowed tokens
    const maxTokens = getMaxTokens(startTime);

    if (Number(dailyTokens) > maxTokens) {
      res.status(400).json({
        message: `Maximum ${maxTokens} tokens are allowed for a ${startTime} start time`,
        maxTokens,
      });
      return;
    }

    if (Number(dailyTokens) < 1) {
      res.status(400).json({
        message: "Daily tokens must be at least 1",
      });
      return;
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      qualification,
      experience,
      consultationFee,
      image: image || "",
      availableDays,
      startTime,
      dailyTokens,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getDoctors = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctors = await Doctor.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAdminDoctors = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctors = await Doctor.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error("Get admin doctors error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getDoctorById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404).json({
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error("Get doctor error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      res.status(404).json({
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Update doctor error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deactivateDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );

    if (!doctor) {
      res.status(404).json({
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      message: "Doctor deactivated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Deactivate doctor error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const activateDoctor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        isActive: true,
      },
      {
        new: true,
      },
    );

    if (!doctor) {
      res.status(404).json({
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      message: "Doctor activated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Activate doctor error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

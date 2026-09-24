import { Router } from "express";

import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = Router();

router.post("/", protect, createAppointment);

router.get("/my", protect, getMyAppointments);

router.get("/admin", protect, adminOnly, getAllAppointments);

router.put("/:id/status", protect, adminOnly, updateAppointmentStatus);

export default router;

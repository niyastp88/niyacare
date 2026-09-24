import { Router } from "express";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deactivateDoctor,
  activateDoctor,
  getAdminDoctors,
} from "../controllers/doctorController";

import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = Router();

router.get("/", getDoctors);

router.get("/admin", protect, adminOnly, getAdminDoctors);

router.get("/:id", getDoctorById);

router.post("/", protect, adminOnly, createDoctor);

router.put("/:id", protect, adminOnly, updateDoctor);

router.put("/:id/deactivate", protect, adminOnly, deactivateDoctor);

router.put("/:id/activate", protect, adminOnly, activateDoctor);

export default router;

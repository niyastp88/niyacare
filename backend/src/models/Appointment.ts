import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  date: string;
  slot: string;
  tokenNumber: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const appointmentSchema = new Schema<IAppointment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    slot: {
      type: String,
      required: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model<IAppointment>(
  'Appointment',
  appointmentSchema
);

export default Appointment;
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const AppointmentSchema = new mongoose.Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  numberOfTerms: { type: Number, required: true },
  salonId: {
    type: mongoose.Types.ObjectId,
    ref: ModelNames.SALON,
    required: true,
  },
  hairStylistId: {
    type: mongoose.Types.ObjectId,
    ref: ModelNames.HAIRSTYLIST,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: ModelNames.USER,
    required: true,
  },
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: ModelNames.SERVICE,
    required: true,
  },
});

AppointmentSchema.index(
  { time: 1, date: 1, hairStylistId: 1 },
  { unique: true },
);

export interface Appointment {
  time: string;
  date: string;
  numberOfTerms: number;
  salonId: mongoose.Types.ObjectId;
  hairStylistId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  id?: string;
}

export interface AppointmentDocument extends mongoose.Document, Appointment {
  id: string;
}

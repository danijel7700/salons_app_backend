import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  terms: { type: Number, required: true },
  salonId: {
    type: mongoose.Types.ObjectId,
    ref: ModelNames.SALON,
    required: true,
  },
});

ServiceSchema.index({ name: 1, salonId: 1 }, { unique: true });

export interface Service {
  name: string;
  cost: number;
  terms: number;
  salonId: mongoose.Types.ObjectId;
  id?: string;
}

export interface ServiceDocument extends mongoose.Document, Service {
  id: string;
}

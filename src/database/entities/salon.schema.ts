import mongoose, { modelNames } from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const SalonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      street: { type: String, required: true },
      number: { type: String, required: true }, // because location can be -- something bb
    },
    city: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    PIB: { type: Number, requred: true, unique: true },
    isVerified: { type: Boolean, requred: true },
    type: { type: String, requried: true },
    workTime: [{ type: String, required: true }],
    markInfo: {
      mark: { type: Number },
      numberOfMarks: { type: Number },
    },
    resetToken: { type: String, select: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

SalonSchema.index({ name: 1, location: 1, city: 1 }, { unique: true });

SalonSchema.virtual('services', {
  ref: ModelNames.SERVICE,
  localField: '_id',
  foreignField: 'salonId',
  justOne: false,
});

SalonSchema.virtual('posts', {
  ref: ModelNames.POST,
  localField: '_id',
  foreignField: 'salonId',
  justOne: false,
});

SalonSchema.virtual('notifications', {
  ref: ModelNames.NOTIFICATION,
  localField: '_id',
  foreignField: 'salonId',
  justOne: false,
});

SalonSchema.virtual('appointments', {
  ref: ModelNames.APPOINTMENT,
  localField: '_id',
  foreignField: 'salonId',
  justOne: false,
});

SalonSchema.virtual('hairStylists', {
  ref: ModelNames.HAIRSTYLIST,
  localField: '_id',
  foreignField: 'salonId',
  justOne: false,
});

export interface Salon {
  name: string;
  location: {
    street: string;
    number: string;
  };
  city: string;
  email: string;
  password: string;
  PIB: number;
  isVerified: boolean;
  type: string;
  workTime: string[7];
  markInfo?: {
    mark: number;
    numberOfMarks: number;
  };
  resetToken?: string;
  id?: string;
}

export interface UserDocument extends mongoose.Document, Salon {
  id: string;
}

import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, requreid: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    phoneNumber: {
      refferenceNumber: { type: String, required: true },
      number: { type: String, required: true },
    },
    ratedSalons: [{ type: mongoose.Types.ObjectId }],
    followedSalons: [{ type: mongoose.Types.ObjectId }],
    resetToken: { type: String, select: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

UserSchema.virtual('appointments', {
  ref: ModelNames.APPOINTMENT,
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});

export interface User {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: {
    refferenceNumber: string;
    number: string;
  };
  ratedSalons: mongoose.Types.ObjectId[];
  followedSalons: mongoose.Types.ObjectId[];
  resetToken?: string;
  id?: string;
}

export interface UserDocument extends mongoose.Document, User {
  id: string;
}

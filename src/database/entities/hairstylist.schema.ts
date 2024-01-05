import mongoose, { Mongoose } from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const HairStylistSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  salonId: { type: mongoose.Types.ObjectId, required: true },
});

export interface HairStylist {
  first_name: string;
  last_name: string;
  salonId: mongoose.Types.ObjectId;
  id?: string;
}

export interface HairStylistDocument extends mongoose.Document, HairStylist {
  id: string;
}

import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const NotificationSchema = new mongoose.Schema({
  content: { type: String, require: true },
  time: { type: String, required: true },
  salonName: { type: String, required: true },
});

export interface Notification {
  content: string;
  time: string;
  salonName: string;
  id?: string;
}

export interface NotificationDocument extends mongoose.Document, Notification {
  id: string;
}

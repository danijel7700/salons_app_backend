import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export interface Admin {
  username: string;
  password: string;
  id?: string;
}

export interface AdminDocument extends mongoose.Document, Admin {
  id: string;
}

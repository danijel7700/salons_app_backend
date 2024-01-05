import { string } from 'joi';
import mongoose from 'mongoose';
import { ModelNames } from 'src/constants/modelNames';

export const PostSchema = new mongoose.Schema({
  image: { type: String, require: true },
  time: { type: String, required: true },
  salonId: {
    type: mongoose.Types.ObjectId,
    ref: ModelNames.SALON,
    required: true,
  },
});

PostSchema.index({ image: 1, salonId: 1 }, { unique: true });

export interface Post {
  image: string;
  time: string;
  salonId: mongoose.Types.ObjectId;
  id?: string;
}

export interface PostDocument extends mongoose.Document, Post {
  id: string;
}

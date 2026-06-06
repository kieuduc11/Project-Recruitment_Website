import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

class UserInfo {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;
}

class History {
  @Prop({
    enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'],
    required: true,
  })
  status: string;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: UserInfo })
  updatedBy: UserInfo;
}

@Schema({ timestamps: true })
export class Resume {
  @Prop({ required: true })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({
    enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  })
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [History], default: [] })
  history: History[];

  // Soft delete
  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: UserInfo })
  createdBy: UserInfo;

  @Prop({ type: UserInfo })
  updatedBy: UserInfo;

  @Prop({ type: UserInfo })
  deletedBy: UserInfo;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
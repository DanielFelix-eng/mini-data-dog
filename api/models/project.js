import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectType: {
      type: String,
      enum: ['Website', 'API', 'Backend Service'],
      default: 'Website',
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    apiBaseUrl: {
      type: String,
      trim: true,
    },
    environment: {
      type: String,
      enum: ['Development', 'Staging', 'Production'],
      default: 'Development',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Archived'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
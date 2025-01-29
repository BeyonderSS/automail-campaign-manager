import mongoose from "mongoose";

const loopSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Index for faster searches
  description: { type: String },
  emails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmailQueue' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Index for user-based queries
  status: {
    type: String,
    enum: ['incomplete', 'pending', 'in-progress', 'completed', 'failed'],
    default: 'pending',
    index: true, // Queries for different statuses will be faster
  },
  totalEmails: { type: Number },
  sentEmails: { type: Number, default: 0 },
  failedEmails: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true }, // Indexed for sorting
  completedAt: { type: Date },
});

const Loop = mongoose.models.Loop || mongoose.model('Loop', loopSchema);
export default Loop;

import mongoose from "mongoose";

const emailQueueSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true }, // Index to improve search speed for recipient
  dynamicFields: { type: Map, of: String },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  documentGallary: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentGallery', index: true }, // Indexed for lookup
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true, // Indexed for filtering
  },
  errorMessage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, index: true }, // Indexed for sorting by creation date
  sentAt: { type: Date },
});

const EmailQueue = mongoose.models.EmailQueue || mongoose.model('EmailQueue', emailQueueSchema);
export default EmailQueue;

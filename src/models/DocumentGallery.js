import mongoose from "mongoose";

const documentGallerySchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Indexed for search
  url: { type: String, required: true },
  fileKey: { type: String, required: true, unique: true, index: true }, // Unique index to prevent duplicates
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Indexed for user-based queries
});

const DocumentGallery = mongoose.models.DocumentGallery || mongoose.model('DocumentGallery', documentGallerySchema);
export default DocumentGallery;

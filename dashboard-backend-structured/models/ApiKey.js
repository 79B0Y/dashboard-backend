import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ApiKey', apiKeySchema);

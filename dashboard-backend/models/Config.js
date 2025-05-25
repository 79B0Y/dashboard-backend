import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  layout: Object,
  versions: [Object],
}, { timestamps: true });

export default mongoose.model('Config', configSchema);

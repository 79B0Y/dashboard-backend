
import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  userId: { type: String, unique: true },
  key: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('ApiKey', schema);

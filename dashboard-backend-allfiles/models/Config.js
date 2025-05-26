
import mongoose from 'mongoose';
const cardSchema = new mongoose.Schema({}, { strict: false });
const configSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  layout: { cards: [cardSchema] },
  versions: [Object]
}, { timestamps: true });
export default mongoose.model('Config', configSchema);

import { v4 as uuidv4 } from 'uuid';
import ApiKey from '../models/ApiKey.js';

export const createApiKey = async (req, res) => {
  const key = uuidv4();
  const apiKey = new ApiKey({ key });
  await apiKey.save();
  res.json({ key });
};

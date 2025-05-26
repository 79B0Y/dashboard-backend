
import { v4 as uuidv4 } from 'uuid';
import ApiKey from '../models/ApiKey.js';

export const createApiKey = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const existing = await ApiKey.findOne({ userId });
  if (existing) return res.json({ key: existing.key });
  const key = uuidv4();
  await ApiKey.create({ userId, key });
  res.json({ key });
};

export const getApiKey = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const doc = await ApiKey.findOne({ userId });
  if (!doc) return res.status(404).json({ error: 'API key not found for this user' });
  res.json({ key: doc.key });
};

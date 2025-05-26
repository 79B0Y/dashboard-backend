
import mongoose from 'mongoose';
import Config from '../models/Config.js';
import { broadcast } from '../services/wsHub.js';

export const getConfig = async (req, res) => {
  const userId = req.apiKey;
  const cfg = await Config.findOne({ userId }) || {};
  res.json(cfg);
};

export const updateConfig = async (req, res) => {
  const userId = req.apiKey;
  const updated = await Config.findOneAndUpdate(
    { userId },
    { $set: req.body },
    { upsert: true, new: true }
  );
  broadcast({ type: 'configUpdated', userId });
  res.json({ ok: true, config: updated });
};

export const aggregateData = async (req, res) => {
  const { collection, pipeline, cardTitle } = req.body;
  try {
    const db = mongoose.connection.db;
    const result = await db.collection(collection).aggregate(pipeline).toArray();
    const value = result[0] || {};
    res.json({ value });
    broadcast({ type: 'cardUpdated', userId: req.apiKey, cardTitle, value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

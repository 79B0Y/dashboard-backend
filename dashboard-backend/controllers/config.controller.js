import Config from '../models/Config.js';

export const getConfig = async (req, res) => {
  const userId = req.apiKey; // injected from auth middleware
  const config = await Config.findOne({ userId });
  res.json(config || {});
};

export const updateConfig = async (req, res) => {
  const userId = req.apiKey;
  const updated = await Config.findOneAndUpdate(
    { userId },
    { $set: req.body, $push: { versions: req.body } },
    { upsert: true, new: true }
  );
  res.json({ ok: true, config: updated });
};

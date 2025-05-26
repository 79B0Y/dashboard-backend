
import mongoose from 'mongoose';
const Dashboards = mongoose.connection.collection('dashboards');

export const listDashboards = async (req, res) => {
  const list = await Dashboards.find({ userId: req.apiKey })
    .project({ _id: 0, dashboardId: 1, name: 1, icon: 1 })
    .toArray();
  res.json(list);
};

export const getDashboard = async (req, res) => {
  const doc = await Dashboards.findOne({ userId: req.apiKey, dashboardId: req.params.id });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
};

export const updateDashboard = async (req, res) => {
  const filter = { userId: req.apiKey, dashboardId: req.params.id };
  const update = { $set: { ...req.body, updatedAt: new Date() } };
  const doc = await Dashboards.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after' });
  res.json(doc.value);
};

export const deleteDashboard = async (req, res) => {
  await Dashboards.deleteOne({ userId: req.apiKey, dashboardId: req.params.id });
  res.json({ ok: true });
};

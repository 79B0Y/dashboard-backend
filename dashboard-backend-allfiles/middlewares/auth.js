
export const authMiddleware = (req, res, next) => {
  const key = req.headers['x-api-key'] || req.query.key;
  if (!key) return res.status(401).json({ error: 'API key required' });
  req.apiKey = key;
  next();
};

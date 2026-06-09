/**
 * Simple API key middleware.
 * Set API_SECRET_KEY in .env and pass it as:
 *   Authorization: Bearer <key>
 * or
 *   x-api-key: <key>
 */
const apiKeyAuth = (req, res, next) => {
  // Skip auth in development if no key is configured
  if (!process.env.API_SECRET_KEY) return next();

  const authHeader = req.headers["authorization"];
  const apiKey = req.headers["x-api-key"];

  const token = apiKey || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (!token || token !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

module.exports = { apiKeyAuth };

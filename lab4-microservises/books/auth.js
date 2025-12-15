const jwt = require('jsonwebtoken');
const JWT_SECRET = '123';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: 'Brak tokena' });

  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ error: 'Niepoprawny format tokena' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Niepoprawny lub wygasły token' });
  }
};

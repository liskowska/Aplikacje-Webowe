const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./UserModel');

const router = express.Router();
const JWT_SECRET = 'supersecretkey'; // w produkcji trzymać w ENV

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ error: 'Brak email lub hasła' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ id: newUser.id });
  } catch (err) {
    console.error('BŁĄD /register:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ error: 'Brak email lub hasła' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Nie ma takiego użytkownika' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Błędne hasło' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('BŁĄD /login:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

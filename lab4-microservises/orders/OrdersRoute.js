const express = require('express');
const { Order } = require('./OrderModel');
const auth = require('./auth');

const router = express.Router();
const JWT_SECRET = '123';

router.get('/orders/:userId', async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.params.userId } });
  res.json(orders);
});

router.post('/orders', auth, async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;
    if (!userId || !bookId || !quantity) return res.status(422).json({ error: 'Brak danych' });

    const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
    if (!response.ok) return res.status(404).json({ error: 'Nie ma takiej książki' });

    const newOrder = await Order.create({ userId, bookId, quantity });
    res.status(201).json({ id: newOrder.id });
  } catch (err) {
    console.error('BŁĄD w POST /orders:', err);
    res.status(500).json({ 
      error: 'Błąd serwera podczas tworzenia zamówienia',
      details: err.message
    });
  }
});


router.delete('/orders/:orderId', auth, async (req, res) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Nie ma takiego zamówienia' });

  await order.destroy();
  res.json({ ok: true });
});

router.patch('/orders/:orderId', auth, async (req, res) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Nie ma takiego zamówienia' });

  const updatedOrder = await order.update(req.body);
  res.json(updatedOrder);
});

module.exports = router;

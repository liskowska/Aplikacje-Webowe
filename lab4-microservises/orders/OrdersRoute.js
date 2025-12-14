const express = require('express');
// const fetch = require('node-fetch');
const { Order } = require('./OrderModel');

const router = express.Router(); // <-- używamy routera

// GET zamówienia użytkownika
router.get('/orders/:userId', async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.params.userId } });
  res.json(orders);
});

router.post('/orders', async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;
    if (!userId || !bookId || !quantity) return res.status(422).json({ error: 'Brak danych' });

    // Sprawdzenie bookId w Serwisie 1 (fetch globalny)
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


// DELETE zamówienia
router.delete('/orders/:orderId', async (req, res) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Nie ma takiego zamówienia' });

  await order.destroy();
  res.json({ ok: true });
});

// PATCH zamówienia
router.patch('/orders/:orderId', async (req, res) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Nie ma takiego zamówienia' });

  const updatedOrder = await order.update(req.body);
  res.json(updatedOrder);
});

module.exports = router; // <-- eksportujemy router

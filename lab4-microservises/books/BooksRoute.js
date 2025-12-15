const express = require('express');
const { Book } = require('./BookModel');
const auth = require('./auth');

const router = express.Router();
const JWT_SECRET = '123';

router.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get('/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Nie ma takiej książki' });
  res.json(book);
});

router.post('/books', auth,  async (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) return res.status(422).json({ error: 'Brak wymaganych danych' });

  const newBook = await Book.create({ title, author, year });
  res.status(201).json(newBook);
});

router.delete('/books/:id', auth, async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Nie ma takiej książki' });

  await book.destroy();
  res.json({ ok: true });
});

router.patch('/books/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ error: 'Nie ma takiej książki' });

      const updatedBook = await book.update(req.body);

      res.json(updatedBook);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Błąd serwera podczas aktualizacji książki' });
    }
});


module.exports = router;

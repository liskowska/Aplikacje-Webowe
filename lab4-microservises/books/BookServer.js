const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./BookModel');
const bookRoutes = require('./BooksRoute');

const app = express();
app.use(bodyParser.json());

sequelize.sync()
  .then(() => console.log('SQLite DB Connected'))
  .catch(err => console.log('DB connection error:', err));

app.use('/api', bookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'The requested URL could not be found.', statusCode: 404 });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    message: 'Internal server error',
    data: { code: error.code || '', stacktrace: error.stack }
  });
});

const PORT = 8080;
app.listen(PORT, () => console.log('Book server started on port ' + PORT));

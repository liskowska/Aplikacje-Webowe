const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./OrderModel');
const ordersRoute = require('./OrdersRoute');

const app = express();
app.use(bodyParser.json());

sequelize.sync().then(() => console.log('Orders SQLite DB Connected'));

app.use('/api', ordersRoute);

app.use((req, res) => res.status(404).json({ message: 'The requested URL could not be found.', statusCode: 404 }));

const PORT = 8090;
app.listen(PORT, () => console.log('Orders server started on port ' + PORT));

const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./UserModel');
const usersRoute = require('./UserRoute');

const app = express();
app.use(bodyParser.json());

sequelize.sync().then(() => console.log('Users SQLite DB Connected'));

app.use('/api', usersRoute);

app.use((req, res) => res.status(404).json({ message: 'The requested URL could not be found.', statusCode: 404 }));

const PORT = 8070;
app.listen(PORT, () => console.log('Users server started on port ' + PORT));

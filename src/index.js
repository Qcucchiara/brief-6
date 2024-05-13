const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const routeGuest = require('./Routes/guest');
const routeUser = require('./Routes/user');
const routeAdmin = require('./Routes/admin');

app.use('/api/guest', routeGuest);
app.use('/api/user', routeUser);
app.use('/api/admin', routeAdmin);

app.listen(process.env.PORT, () => {
  console.log('im listening on port', process.env.PORT);
});

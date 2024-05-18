const express = require('express');
const cors = require('cors');
const { connect } = require('./Services/mongodb');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

connect(process.env.MONGODB_URI, (error) => {
  if (error) {
    console.log('Failed to connect');
    process.exit(-1);
  } else {
    console.log('successfully connected');
  }
});

const routeGuest = require('./Routes/guest');
const routeUser = require('./Routes/user');
const routeAdmin = require('./Routes/admin');

app.use('/api/guest', routeGuest);
app.use('/api/user', routeUser);
app.use('/api/admin', routeAdmin);

app.listen(process.env.PORT, () => {
  console.log('im listening on port', process.env.PORT);
});

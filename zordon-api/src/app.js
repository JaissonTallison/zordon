const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ZORDON API funcionando');
});

module.exports = app;

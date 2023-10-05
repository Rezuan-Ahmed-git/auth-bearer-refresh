const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRouter = require('./authRoutes');
const appRouter = require('./appRoutes');

const app = express();

app.use([cors(), morgan('dev'), express.json()]);

app.use('/auth', authRouter);
app.use('/', appRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});

mongoose.connect('mongodb://127.0.0.1:27017/api-security-practice').then(() => {
  app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  });

  console.log('Database is connected');
});

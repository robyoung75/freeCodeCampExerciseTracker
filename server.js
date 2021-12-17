const mySecret = process.env['MONGO_URI']
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000;

// mongodb connection
mongoose.connect(mySecret, { useNewURLParser: true, useUnifiedTopology: true });

const db_connection = mongoose.connection;

db_connection.once("open", () => {
  console.log("MongoDB connection successfully established");
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(authRoutes)

const listener = app.listen(PORT, () => {
  console.log(`Your app is listening on ${PORT} or cool function address setup ${listener.address().port}`)
})

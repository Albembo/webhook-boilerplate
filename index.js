const express = require('express')
const mongoose = require('mongoose')
const webhooks = require('./handlers/webhooks');
const configurations = require('./config/configurations');

const app = express()

// Middleware
app.use(express.json());

// Custom routes
app.use('/action', webhooks);

//you need to set mongodb_uri
mongoose.connect(configurations.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('Connection failed'))

app.listen(configurations.PORT, () => {
    console.log('Server on listening on port 3000')
    }
)

//if you have to start the project digit npm init and press enter
//if you want to set a git project digit git init and press enter
// you have to install express, mongoose, @assistant/conversation
// npm i express mongoose @assistant/conversation
//to start ngrok after installing, you have to digit ngrok http 3000 and press enter
//to start the server digit node index.js and press enter
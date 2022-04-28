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

//
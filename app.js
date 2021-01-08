const express = require('express')
const app = express()
const config = require('./utils/config')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Could not connect to MongoDB:', error.message)
    })

app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})

module.exports = app
const express = require('express')
const app = express()
const config = require('./utils/config')
const mongoose = require('mongoose')
const beersRouter = require('./controllers/beers')
const breweriesRouter = require('./controllers/breweries')
const countriesRouter = require('./controllers/countries')
const stylesRouter = require('./controllers/styles')
const loginRouter = require('./controllers/login')
const signupRouter = require('./controllers/signup')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Could not connect to MongoDB:', error.message)
    })

app.use(express.json())
app.use('/api/beers', beersRouter)
app.use('/api/breweries', breweriesRouter)
app.use('/api/countries', countriesRouter)
app.use('/api/styles', stylesRouter)
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)

module.exports = app
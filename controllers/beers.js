const beersRouter = require('express').Router()
const Beer = require('../models/beer')

beersRouter.get('/', async (request, response) => {
    const beers = await Beer.find()
    return response.status(200).json(beers)
})

module.exports = beersRouter
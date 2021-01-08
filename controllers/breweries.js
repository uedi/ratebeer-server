const breweriesRouter = require('express').Router()
const Brewery = require('../models/brewery')

breweriesRouter.get('/', async (request, response) => {
    const breweries = await Brewery.find()
    return response.status(200).json(breweries)
})

module.exports = breweriesRouter
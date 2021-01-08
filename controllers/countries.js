const countriesRouter = require('express').Router()
const Country = require('../models/country')

countriesRouter.get('/', async (request, response) => {
    const countries = await Country.find()
    return response.status(200).json(countries)
})

module.exports = countriesRouter
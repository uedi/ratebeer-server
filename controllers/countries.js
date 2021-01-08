const countriesRouter = require('express').Router()

countriesRouter.get('/', async (request, response) => {
    const countries = []
    return response.status(200).json(countries)
})

module.exports = countriesRouter
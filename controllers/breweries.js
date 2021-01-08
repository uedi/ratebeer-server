const breweriesRouter = require('express').Router()

breweriesRouter.get('/', async (request, response) => {
    const breweries = []
    return response.status(200).json(breweries)
})

module.exports = breweriesRouter
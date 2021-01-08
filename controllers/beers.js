const beersRouter = require('express').Router()

beersRouter.get('/', async (request, response) => {
    const beers = []
    return response.status(200).json(beers)
})

module.exports = beersRouter
const breweriesRouter = require('express').Router()
const Brewery = require('../models/brewery')

breweriesRouter.get('/', async (request, response) => {
    const breweries = await Brewery.find()
    return response.status(200).json(breweries)
})

breweriesRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({ error: 'Name is required.' })
    }

    const brewery = new Brewery({
        name: body.name,
    })

    if(body.year) {
        brewery.year = body.year
    }

    if(body.country) {
        brewery.country = body.country
    }
    
    const savedBrewery = await brewery.save()

    return response.status(201).json(savedBrewery.toJSON())
})

module.exports = breweriesRouter
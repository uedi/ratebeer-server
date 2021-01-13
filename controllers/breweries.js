const breweriesRouter = require('express').Router()
const Brewery = require('../models/brewery')
const Country = require('../models/country')

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
        name: body.name
    })

    if(body.year && !Number.isInteger(body.year)) {
        return response.status(400).json({ error: 'Year must be integer.' })
    } else if(body.year) {
        brewery.year = body.year
    }

    if(body.country) {
        const country = await Country.findById(body.country)
        if(!country) {
            return response.status(400).json({ error: 'Country does not exist.' })
        }
        
        const existingBrewery = await Brewery.findOne({ name: body.name, country: body.country })

        if(existingBrewery) {
            return response.status(400).json({ error: 'Same named brewery already exist in the country.' })
        }
        brewery.country = body.country
    }
    
    const savedBrewery = await brewery.save()

    return response.status(201).json(savedBrewery.toJSON())
})

module.exports = breweriesRouter
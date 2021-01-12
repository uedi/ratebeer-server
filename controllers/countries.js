const countriesRouter = require('express').Router()
const Country = require('../models/country')

countriesRouter.get('/', async (request, response) => {
    const countries = await Country.find()
    return response.status(200).json(countries)
})

countriesRouter.post('/', async (request, response) => {
    const body = request.body
    
    if(!body.name) {
        return response.status(400).json({ error: 'Name is required.' })
    }

    const countryWithSameUsername = await Country.findOne({ name: body.name })

    if(countryWithSameUsername) {
        return response.status(400).json({ error: 'Name already in use.' })
    }

    const country = new Country({
        name: body.name
    })

    const savedCountry = await country.save()

    return response.status(201).json(savedCountry.toJSON())
})

module.exports = countriesRouter
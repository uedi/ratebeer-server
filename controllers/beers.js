const beersRouter = require('express').Router()
const Beer = require('../models/beer')
const Brewery = require('../models/brewery')
const Style = require('../models/style')

beersRouter.get('/', async (request, response) => {
    const beers = await Beer.find()
    return response.status(200).json(beers)
})

beersRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({ error: 'Name is required.' })
    }

    const beer = new Beer({
        name: body.name
    })

    if(body.brewery) {
        const brewery = await Brewery.findById(body.brewery)

        if(!brewery) {
            return response.status(400).json({ error: 'Brewery does not exist.' })
        }

        const beerWithSameName = await Beer.findOne({ name: body.name, brewery: body.brewery })

        if(beerWithSameName) {
            return response.status(400).json({ error: 'Brewery already has beer with that name.'})
        }

        beer.brewery = body.brewery
    }

    if(body.style) {
        const style = await Style.findById(body.style)

        if(!style) {
            return response.status(400).json({ error: 'Style does not exist.' })
        }

        beer.style = body.style
    }

    const savedBeer = await beer.save()

    return response.status(201).json(savedBeer.toJSON())
})

module.exports = beersRouter
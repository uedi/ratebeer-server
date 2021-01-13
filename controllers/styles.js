const stylesRouter = require('express').Router()
const Style = require('../models/style')

stylesRouter.get('/', async (request, response) => {
    const styles = await Style.find()
    return response.status(200).json(styles)
})

stylesRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({ error: 'Name is required.' })
    }

    const styleWithSameName = await Style.findOne({ name: body.name })
    
    if(styleWithSameName) {
        return response.status(400).json({ error: 'Name already in use.' })
    }

    const style = new Style({
        name: body.name,
        description: body.description
    })

    const savedStyle = await style.save()

    return response.status(201).json(savedStyle.toJSON())
})

module.exports = stylesRouter
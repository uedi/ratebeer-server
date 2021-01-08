const stylesRouter = require('express').Router()
const Style = require('../models/style')

stylesRouter.get('/', async (request, response) => {
    const styles = await Style.find()
    return response.status(200).json(styles)
})

module.exports = stylesRouter
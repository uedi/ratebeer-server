const stylesRouter = require('express').Router()

stylesRouter.get('/', async (request, response) => {
    const styles = []
    return response.status(200).json(styles)
})

module.exports = stylesRouter
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.username || !body.password) {
        return response.status(400).json({ error: 'Username and password required.' })
    }
    
    const savedUser = await User.findOne({ username: body.username })

    const passwordCorrect = savedUser === null
        ? false
        : await bcrypt.compare(body.password, savedUser.passwordHash)

    if(!passwordCorrect) {
        return response.status(401).json({ error: 'Invalid username or password.' })
    }

    const token = jwt.sign({ id: savedUser._id, username: savedUser.username }, process.env.TOKEN_DATA)
    const dataToSend = { token, username: savedUser.username }

    return response.status(200).send(dataToSend)
})

module.exports = loginRouter
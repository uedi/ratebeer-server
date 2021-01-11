const bcrypt = require('bcrypt')
const signupRouter = require('express').Router()
const User = require('../models/user')

signupRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.username || !body.password) {
        return response.status(400).json({ error: 'Username and password required.' })
    }

    const userWithSameUsername = await User.findOne({ username: body.username })

    if(userWithSameUsername) {
        return response.status(400).json({ error: 'Username already in use.' })
    }

    const saltrounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltrounds)

    const user = new User({
        username: body.username,
        passwordHash
    })
    
    await user.save()

    return response.status(201).end()

})

module.exports = signupRouter
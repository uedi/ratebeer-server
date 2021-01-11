const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const signupUrl = '/api/signup'

beforeEach(async () => {
    await User.deleteMany({})
})

describe('signup', () => {
    test('is not possible with invalid data', async () => {
        const withoutPassword = await api
            .post(signupUrl)
            .send({ username: 'dude' })
            .expect(400)
        expect(withoutPassword.body.error).toBeDefined()
        expect(withoutPassword.body.error).toBe('Username and password required.')

        const withoutUsername = await api
            .post(signupUrl)
            .send({ password: 'password' })
            .expect(400)
        expect(withoutUsername.body.error).toBeDefined()
        expect(withoutUsername.body.error).toBe('Username and password required.')
    })
    test('is possible with proper data', async () => {
        await api
            .post(signupUrl)
            .send({ username: 'dude', password: 'password123' })
            .expect(201)
    })
    test('is not possible if username already in use', async () => {
        const userToCreate = { username: 'dude', password: 'password123'}

        await api
            .post(signupUrl)
            .send(userToCreate)
            .expect(201)

        const withSameData = await api
            .post(signupUrl)
            .send(userToCreate)
            .expect(400)
        expect(withSameData.body.error).toBeDefined()
        expect(withSameData.body.error).toBe('Username already in use.')
    })
})

afterAll(() => {
    mongoose.connection.close()
})
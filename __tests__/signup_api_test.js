const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const signupUrl = '/api/signup'

const validUser = { username: 'dude', password: 'password123'}

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
            .send(validUser)
            .expect(201)
    })
    test('is not possible if username already in use', async () => {
        await api
            .post(signupUrl)
            .send(validUser)
            .expect(201)

        const withSameData = await api
            .post(signupUrl)
            .send(validUser)
            .expect(400)
        expect(withSameData.body.error).toBeDefined()
        expect(withSameData.body.error).toBe('Username already in use.')
    })
    test('returns token and username', async () => {
        const response = await api
        .post(signupUrl)
        .send(validUser)
        .expect(201)
        expect(response.body.token).toBeDefined()
        expect(response.body.token.length > 0).toBe(true)
        expect(response.body.username).toBeDefined()
        expect(response.body.username).toBe(validUser.username)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
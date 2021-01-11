const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const loginUrl = '/api/login'
const signupUrl = '/api/signup'

const testUser = { username: 'dude1', password: 'password1' }

beforeEach(async () => {
    await User.deleteMany({})
    await api
        .post(signupUrl)
        .send(testUser)
        .expect(201)
})

describe('login', () => {
    test('is possible with correct username and password', async () => {
        await api
            .post(loginUrl)
            .send(testUser)
            .expect(200)
    })

    test('is not possible if username or password missing', async () => {
        const noUsername = await api
            .post(loginUrl)
            .send({ password: testUser.password })
            expect(400)
        expect(noUsername.body.error).toBeDefined()
        expect(noUsername.body.error).toBe('Username and password required.')

        const noPassword = await api
            .post(loginUrl)
            .send({ username: testUser.username })
            expect(400)
        expect(noPassword.body.error).toBeDefined()
        expect(noPassword.body.error).toBe('Username and password required.')
    })

    test('is not possible with incorrect password', async () => {
        const incorrectPassword = await api
            .post(loginUrl)
            .send({ username: 'dude1', password: 'wrong'})
            .expect(401)
        expect(incorrectPassword.body.error).toBeDefined()
        expect(incorrectPassword.body.error).toBe('Invalid username or password.')
    })

    test('successful login contains correct data', async () => {
        const response = await api
            .post(loginUrl)
            .send(testUser)
            .expect(200)
        const body = response.body
        expect(body.username).toBeDefined()
        expect(body.token).toBeDefined()
        expect(body.id).toBe(undefined)
        expect(body._id).toBe(undefined)
        expect(body.password).toBe(undefined)
        expect(body.passwordHash).toBe(undefined)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Country = require('../models/country')

const country1 = { name: "Finland" }
const country2 = { name: "Germany" }
const country3 = { name: "Japan" }

beforeEach(async () => {
    await Country.deleteMany({})
    await Country.insertMany([country3])
})

describe('GET /api/countries', () => {
    test('returns empty list when no countries saved to db', async () => {
        await Country.deleteMany({})
        const response = await api.get('/api/countries').expect(200)
        expect(response.body).toEqual([])
    })
})

describe('POST /api/countries', () => {
    test('multiple countries can be created', async () => {
        const response1 = await api.post('/api/countries')
        .send(country1)
        .expect(201)

        const response2 = await api.post('/api/countries')
        .send(country2)
        .expect(201)

        expect(response1.body.name).toEqual(country1.name)
        expect(response2.body.name).toEqual(country2.name)

        const response3 = await api.get('/api/countries').expect(200)
        expect(response3.body.length).toEqual(3)
    })
    test('country name must be unique', async () => {
        await api.post('/api/countries')
        .send(country3)
        .expect(400)
    })
    test('country must have a name', async () => {
        await api.post('/api/countries')
        .send({ notname: "Sweden" })
        .expect(400)
    })
    test('returned country has correct fields', async () => {
        const response = await api.post('/api/countries')
        .send(country1)
        expect(201)

        expect(response.body.name).toBeDefined()
        expect(response.body.id).toBeDefined()
        expect(response.body.id.length > 0).toBe(true)
        expect(response.body._id).toBe(undefined)
        expect(response.body.__v).toBe(undefined)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
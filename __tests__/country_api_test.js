const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Country = require('../models/country')

beforeEach(async () => {
    await Country.deleteMany({})
})

describe('GET /api/countries', () => {
    test('returns empty list when no countries saved to db', async () => {
        const response = await api.get('/api/countries').expect(200)
        expect(response.body).toEqual([])
    })
})

afterAll(() => {
    mongoose.connection.close()
})
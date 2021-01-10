const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Brewery = require('../models/brewery')

beforeEach(async () => {
    await Brewery.deleteMany({})
})

describe('GET /api/breweries', () => {
    test('returns empty list when no breweries saved to db', async () => {
        const response = await api.get('/api/breweries').expect(200)
        expect(response.body).toEqual([])
    })
})

afterAll(() => {
    mongoose.connection.close()
})
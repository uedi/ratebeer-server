const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Beer = require('../models/beer')

beforeEach(async () => {
    await Beer.deleteMany({})
})

describe('GET /api/beers', () => {
    test('returns empty list when no beers saved to db', async () => {
        const response = await api.get('/api/beers').expect(200)
        expect(response.body).toEqual([])
    })
})

afterAll(() => {
    mongoose.connection.close()
})
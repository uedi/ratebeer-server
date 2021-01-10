const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Style = require('../models/style')

beforeEach(async () => {
    await Style.deleteMany({})
})

describe('GET /api/styles', () => {
    test('returns empty list when no styles saved to db', async () => {
        const response = await api.get('/api/styles').expect(200)
        expect(response.body).toEqual([])
    })
})

afterAll(() => {
    mongoose.connection.close()
})
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Beer = require('../models/beer')
const Brewery = require('../models/brewery')
const Style = require('../models/style')

const baseUrl = '/api/beers'
const beer1 = { name: 'beer1' }
const beer2 = { name: 'beer2' }
const beer3 = { name: 'beer2' }

beforeEach(async () => {
    await Beer.deleteMany({})
    await Brewery.deleteMany({})
    await Style.deleteMany({})
    await Beer.insertMany([beer3])
})

describe('GET /api/beers', () => {
    test('returns empty list when no beers saved to db', async () => {
        await Beer.deleteMany({})
        const response = await api.get('/api/beers').expect(200)
        expect(response.body).toEqual([])
    })
})

describe('POST /api/beers', () => {
    test('beers can be created', async () => {
        const response1 = await api.post(baseUrl)
        .send(beer1)
        expect(201)
        
        const response2 = await api.post(baseUrl)
        .send(beer2)
        .expect(201)

        expect(response1.body.name).toEqual(beer1.name)
        expect(response2.body.name).toEqual(beer2.name)
    })
    test('beer must have a name', async () => {
        const beerWithoutName = {}
        const response = await api.post(baseUrl)
        .send(beerWithoutName)
        .expect(400)

        expect(response.body.error).toBeDefined()
        expect(response.body.error).toBe('Name is required.')
    })
})

afterAll(() => {
    mongoose.connection.close()
})
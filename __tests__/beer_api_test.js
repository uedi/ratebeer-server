const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Beer = require('../models/beer')
const Brewery = require('../models/brewery')
const Style = require('../models/style')

const baseUrl = '/api/beers'
const breweryUrl = '/api/breweries'
const beer1 = { name: 'beer1' }
const beer2 = { name: 'beer2' }
const beer3 = { name: 'beer2' }
const brewery1 = { name: 'brewery1' }
const brewery2 = { name: 'brewery2' }

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
    test('unique beer name for each brewery', async () => {

        const brewery1response = await api.post(breweryUrl)
        .send(brewery1)
        .expect(201)

        const brewery2response = await api.post(breweryUrl)
        .send(brewery2)
        .expect(201)

        const firstBeer = { name: 'first', brewery: brewery1response.body.id }
        const secondBeer = { name: 'second', brewery: brewery2response.body.id }
        
        await api.post(baseUrl).send(firstBeer).expect(201)
        await api.post(baseUrl).send(secondBeer).expect(201)

        await api.post(baseUrl).send(firstBeer).expect(400)
        await api.post(baseUrl).send(secondBeer).expect(400)

        firstBeer.brewery = brewery2response.body.id
        secondBeer.brewery = brewery1response.body.id
        await api.post(baseUrl).send(firstBeer).expect(201)
        await api.post(baseUrl).send(secondBeer).expect(201)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
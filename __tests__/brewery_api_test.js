const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Brewery = require('../models/brewery')

const brewery1 = { name: 'Brewery1', year: 1899 }
const brewery2 = { name: 'Brewery2', year: 1898 }
const brewery3 = { name: 'Brewery3' }

const baseUrl = '/api/breweries'

beforeEach(async () => {
    await Brewery.deleteMany({})
    await Brewery.insertMany([brewery1])
})

describe('GET /api/breweries', () => {
    test('returns empty list when no breweries saved to db', async () => {
        await Brewery.deleteMany({})
        const response = await api.get(baseUrl).expect(200)
        expect(response.body).toEqual([])
    })
})

describe('POST /api/breweries', () => {
    test('breweries can be created', async () => {
        const response1 = await api.post(baseUrl)
        .send(brewery2)
        .expect(201)

        const response2 = await api.post(baseUrl)
        .send(brewery3)
        .expect(201)

        expect(response1.body.name).toEqual(brewery2.name)
        expect(response1.body.year).toEqual(brewery2.year)

        expect(response2.body.name).toEqual(brewery3.name)
    })
    test('brewery must have a name', async () => {
        const breweryWithoutName = { year: 2021 }
        const response = await api.post(baseUrl)
        .send(breweryWithoutName)
        .expect(400)
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toBe('Name is required.')
    })
    test('returned brewery has correct fields', async () => {
        const response = await api.post(baseUrl)
        .send(brewery2)
        .expect(201)

        expect(response.body.name).toBeDefined()
        expect(response.body.year).toBeDefined()
        expect(response.body.id).toBeDefined()
        expect(response.body.id.length > 0).toBe(true)
        expect(response.body.country).toBe(undefined)
        expect(response.body._id).toBe(undefined)
        expect(response.body.__v).toBe(undefined)
        
    })
})

afterAll(() => {
    mongoose.connection.close()
})
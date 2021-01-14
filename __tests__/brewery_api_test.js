const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Brewery = require('../models/brewery')
const Country = require('../models/country')

const brewery1 = { name: 'Brewery1', year: 1899 }
const brewery2 = { name: 'Brewery2', year: 1898 }
const brewery3 = { name: 'Brewery3' }

const baseUrl = '/api/breweries'

beforeEach(async () => {
    await Brewery.deleteMany({})
    await Country.deleteMany({})
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

        const createCountryResponse = await api.post('/api/countries')
        .send({ name: 'Country '})
        .expect(201)

        const brewery2withcountry = {...brewery2, country: createCountryResponse.body.id }
        
        const response1 = await api.post(baseUrl)
        .send(brewery2withcountry)
        .expect(201)

        const response2 = await api.post(baseUrl)
        .send(brewery3)
        .expect(201)

        expect(response1.body.name).toEqual(brewery2withcountry.name)
        expect(response1.body.year).toEqual(brewery2withcountry.year)
        expect(response1.body.country).toEqual(brewery2withcountry.country)

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
    test('year must be integer', async () => {
        const valid = { name: 'valid1', year: 2000 }
        const invalid1 = { name: 'invalid1', year: "2000" }
        const invalid2 = { name: 'invalid2', year: true }
        const invalid3 = { name: 'invalid3', year: 2000.1 }

        await api.post(baseUrl).send(valid).expect(201)
        await api.post(baseUrl).send(invalid1).expect(400)
        await api.post(baseUrl).send(invalid2).expect(400)
        await api.post(baseUrl).send(invalid3).expect(400)
    })
    test('country must be found', async () => {
        const createCountryResponse = await api.post('/api/countries')
        .send({ name: 'Country'})
        expect(201)

        const brewery2WithCountry = {...brewery2, country: createCountryResponse.body.id }
        const brewery3WithCountry = {...brewery3, country: '5e4ab9a2fcfb461b4d998fbd'}

        await api.post(baseUrl).send(brewery2WithCountry).expect(201)
        await api.post(baseUrl).send(brewery3WithCountry).expect(400)
    })
    test('brewery with same name and country can not be created twice', async () => {
        const createCountryResponse = await api.post('/api/countries')
        .send({ name: 'Country'})
        expect(201)

        const brewery2WithCountry = {...brewery2, country: createCountryResponse.body.id }

        await api.post(baseUrl).send(brewery2WithCountry).expect(201)
        await api.post(baseUrl).send(brewery2WithCountry).expect(400)
    })

})

afterAll(() => {
    mongoose.connection.close()
})
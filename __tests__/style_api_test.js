const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Style = require('../models/style')

const style1 = { name: 'IPA', description: 'Indian Pale Ale' }
const style2 = { name: 'Porter', description: 'Dark beer'}
const style3 = { name: 'Unknown' }

beforeEach(async () => {
    await Style.deleteMany({})
    await Style.insertMany([style1])
})

describe('GET /api/styles', () => {
    test('returns empty list when no styles saved to db', async () => {
        await Style.deleteMany({})
        const response = await api.get('/api/styles').expect(200)
        expect(response.body).toEqual([])
    })
})

describe('POST /api/styles', () => {
    test('styles can be created', async () => {
        const response1 = await api.post('/api/styles')
        .send(style2)
        .expect(201)

        const response2 = await api.post('/api/styles')
        .send(style3)
        .expect(201)

        expect(response1.body.name).toEqual(style2.name)
        expect(response1.body.description).toEqual(style2.description)

        expect(response2.body.name).toEqual(style3.name)
        expect(response2.body.description).toEqual(undefined)
    })
    test('style name must be unique', async () => {
        const response = await api.post('/api/styles')
        .send(style1)
        .expect(400)

        expect(response.body.error).toBeDefined()
        expect(response.body.error).toBe('Name already in use.')

        await api.post('/api/styles')
        .send(style2)
        .expect(201)
    })
    test('style must have a name', async () => {
        const styleWithoutName = { description: 'description'}
        const response = await api.post('/api/styles')
        .send(styleWithoutName)
        .expect(400)
        expect(response.body.error).toBeDefined()
        expect(response.body.error).toBe('Name is required.')
    })
    test('returned style has coneect fields', async () => {
        const response = await api.post('/api/styles')
        .send(style2)
        .expect(201)
        
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
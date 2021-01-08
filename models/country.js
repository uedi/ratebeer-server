const mongoose = require('mongoose')

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

countrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Country', countrySchema)
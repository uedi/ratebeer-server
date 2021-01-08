const mongoose = require('mongoose')

const brewerySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }
})

brewerySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Brewery', brewerySchema)
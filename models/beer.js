const mongoose = require('mongoose')

const beerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brewery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brewery'
    },
    style: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Style'
    }
})

beerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Beer', beerSchema)
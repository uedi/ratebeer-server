const mongoose = require('mongoose')

const styleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

styleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Style', styleSchema)
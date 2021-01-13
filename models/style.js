const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const styleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    }
})

styleSchema.plugin(uniqueValidator)

styleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Style', styleSchema)
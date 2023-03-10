const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const validatePhoneNumber = function(number) {
  const regex = /\d{3}\-\d{7}/
  return regex.test(number)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 4,
    required: true
  },
  number: {
    type: String,
    validate: [validatePhoneNumber, 'Phone number must be in the format 012-3456789'],
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
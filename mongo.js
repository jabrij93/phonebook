const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jabrijuhinin93:${password}@phonebook.axquldz.mongodb.net/personsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: Number
})

const Persons = mongoose.model('Person', personSchema)

const person = new Persons({
  name: "Yasir",
  number: "012343255421"
})

person.save().then(result=> {
  console.log('person saved!')
  mongoose.connection.close()
})

// Persons.find({name: "Aidil "}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   })
//   mongoose.connection.close()
// })

// Persons.find({}).then(result => {
//   console.log("phonebook:")
//   result.forEach(person => {
//     console.log( person.name + ' ' + person.number) 
//   })
//   mongoose.connection.close()
// })
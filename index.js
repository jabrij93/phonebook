const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Persons = require('./models/persons')
const morgan = require('morgan')

morgan.token('id', (request) => request.params.id)
morgan.token('body', (request) => JSON.stringify(request.body))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message})
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(morgan(':id :url :method :body'))
app.use(express.static('build'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": 5,
      "name": "Jabss", 
      "number": "321321312"
    }
]

const date = new Date()
let toString = date.toString()
let info = [`Phonebook has info for ${persons.length} people` , toString ]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Exercise 3.1 - 3.6 !</h1>')
})

app.get('/api/persons', (request, response) => {
  Persons.find({}).then(person=> { 
    response.json(person)
  })
})

app.get('/info', (request, response) => {
    response.json(info)
})

app.get('/api/persons/:id', (request, response, next) => {
    Persons.findById(request.params.id)
    .then(person=> {
      if(person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
    // const id = Number(request.params.id)
    // const person = persons.find(person=> person.id === id)
  
    // if (person) {
    //   response.json(person)
    // } else {
    //   response.status(404).end()
    // }

const generateId = () => {
    const randomId = persons.length > 0 
        ? Math.floor(Math.random() * 200) 
        : 0
    return randomId
}

// Add new person 
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    const person = new Persons({
        name: body.name,
        number: body.number
    })

    person
      .save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
      .catch(error=>next(error))
    // persons = persons.concat(person)
    // response.json(person)
})

// Edit person info

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
    
  Persons.findByIdAndUpdate(request.params.id, {name, number}, {new:true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Persons.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
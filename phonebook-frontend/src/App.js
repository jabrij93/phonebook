import { useState, useEffect } from 'react'
import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('Notification :)')

  const addName = (event) => {
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber
    }

    const changeNumberText = 'is already added to phonebook, replace the old number with a new one ?'
    const existingPerson = persons.find(person => person.name === nameObject.name)
    
    if (existingPerson && window.confirm(`${existingPerson.name} ${changeNumberText}`)) {
      personService
        .update(existingPerson.id, nameObject)
        .then(response => {
          setPersons(persons.map(person=>person.id === existingPerson.id ? response.data : person))
          setNewName('')
          setNewNumber('')
          setErrorMessage(
            `${existingPerson.name}'s phone number has been updated`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } else if(!existingPerson) {
      personService
        .create(nameObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setErrorMessage(
            `${nameObject.name}'s has been added to the phonebook`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(response=> {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'person')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDelete = (id) => {
    const newPerson = persons.filter((person) => person.id === id)
    const newPersonName = newPerson[0]?.name

    if (newPersonName && window.confirm(`Do you want to delete ${newPersonName} ?`)) {
      personService
        .delete(id)
        .catch(error => {
          setErrorMessage(
            `${newPersonName} has been removed from the server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }) 
        setPersons(newPerson) 
    } 
  }

  return (
    <div>
      <h1> Phonebook </h1>
      <input type="text" placeholder="Search..." onChange= {(event) => setSearchTerm(event.target.value)} />
      <h1> Add Info </h1>
      <Notification message={errorMessage} />
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          phonenumber: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit"> add </button>
        </div>
      </form>

      <h1> Numbers </h1>

      <ul>
      {persons.filter((person) => {
        if (searchTerm === "") {
        return person
      } else if (person.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return person
      }
      }).map((person, id) => {
        return (
        <Person key={person.id} person={person}  deleteButton={()=>handleDelete(person.id)} text='Delete' />
      );
      })
      }
      </ul>
    </div>
  )
}

export default App
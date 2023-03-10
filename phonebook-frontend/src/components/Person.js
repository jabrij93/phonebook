import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'

const Person = ({ person, deleteButton }) => {
  return (
    <div className="phonebook-row">
        <li className='personinfo'> 
          {person.name} {person.number}
        </li>
        <button onClick={deleteButton} className="delete-icon"> <FontAwesomeIcon icon={ faTrashAlt } /> </button>
    </div>
  );
}

export default Person
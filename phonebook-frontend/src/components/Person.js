import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fa-solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro'

const Person = ({person, deleteButton, text}) => {
  return (
    <div>
        <li className='personinfo'> 
          {person.name} {person.number}
          <button onClick={deleteButton}> {text} </button> 
          Test <FontAwesomeIcon icon={fa-solid fa-trash} /> Icon 
        </li>
    </div>
  );
}

export default Person
import { useDragAndDrop } from "fluid-dnd/react";
import './Number.css'
import './css/Person.css'
export const SingleVerticalPersonList: React.FC = () => {
    type Person ={
        number: number,
        name: string,
        edit: boolean
    }
    const [ parent, listValue, setList ] = useDragAndDrop<Person, HTMLUListElement>([
        { number: 1, name: "Carlos", edit: false },
        { number: 2, name: "Jorge", edit: false },
        { number: 3, name: "Ivis", edit: false },
    ]);
    const handleNameChange = (number:number, name: string) => {
        setList(listValue.map(item => 
          item.number === number ? { ...item, name } : item
        ));
      };
    const handleEditChange = (number:number, edit: boolean) => {
        setList(listValue.map(item => 
          item.number === number ? { ...item, edit } : item
        ));
      };
    return (
        <ul ref={parent} className="person-list p-8 bg-[var(--sl-color-gray-6)]">
            {listValue.map((person, index) => (
                <li className="person" data-index={index} key={person.number}>
                     <input type="text" value={person.name} disabled={!person.edit} onChange={(e) => handleNameChange(person.number, e.target.value)}/>
                     <input type="checkbox" checked={person.edit} onChange={() => handleEditChange(person.number, !person.edit)}/> 
                </li>
            ))}
        </ul>
    )
};

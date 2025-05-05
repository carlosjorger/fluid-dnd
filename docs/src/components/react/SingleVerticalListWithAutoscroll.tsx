import { useDragAndDrop } from "fluid-dnd/react";
import './Number.css'
export const SingleVerticalListWithAutoscroll: React.FC = () => {
    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([...Array(20).keys()]);
    return (
        <ul ref={parent} className="block px-2 overflow-y-auto w-10/12 h-80 pl-7">
            {listValue.map((element, index) => (
                <li className="solid mt-1 border-2" data-index={index} key={element}>
                    {element}
                </li>
            ))}
        </ul>
    )
};
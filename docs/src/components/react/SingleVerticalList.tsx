import { useDragAndDrop } from "fluid-dnd/react";
import './Number.css'
export const SingleVerticalList: React.FC = () => {
    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3]);
    return (
        <ul ref={parent} className="number-list p-8 bg-[var(--sl-color-gray-6)]">
            {listValue.map((element, index) => (
                <li className="number" data-index={index} key={element}>
                    {element}
                </li>
            ))}
        </ul>
    )
};
import { useDragAndDrop } from "fluid-dnd/react";
import './css/SingleListWithIsDraggable.css'
export const SingleListWithIsDraggable: React.FC = () => {
    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3, 4],{
      isDraggable: (el) => !el.classList.contains("is-not-draggable"),
    });
    return (
        <ul ref={parent} className="number-list p-8 bg-[var(--sl-color-gray-6)]">
            {listValue.map((element, index) => (
                <li className={`number ${element % 2 == 0 ? 'is-not-draggable' : ''}`} data-index={index} key={element}>
                    {element}
                </li>
            ))}
        </ul>
    )
};
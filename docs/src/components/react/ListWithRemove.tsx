import { useDragAndDrop } from "fluid-dnd/react";
import './css/RemoveNumber.css'
type Props = {
    removingClass?: string,
    delayBeforeRemove?: number
}
export const ListWithRemove: React.FC<Props> = ({removingClass , delayBeforeRemove}) => {
    const [ parent, listValue, ,, removeAt ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3, 4, 5],{
        removingClass,
        delayBeforeRemove
    });
    return (
        <ul ref={parent} className="number-list p-8 bg-[var(--sl-color-gray-6)]">
            {listValue.map((element, index) => (
                <li className="number" data-index={index} key={element}>
                    {element}
                    <button className="remove-button" onClick={() => removeAt(index)}>x</button>
                </li>
            ))}
        </ul>
    )
};
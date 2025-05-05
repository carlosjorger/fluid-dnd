import { useDragAndDrop } from "fluid-dnd/react";
import './css/GroupNumber.css'

type Props = {
    group1?: string,
    group2?: string,
}

export const ListGroup: React.FC<Props> = ({group1 = 'group1', group2 = 'group1'}) => {
    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3, 4, 5],{
        droppableGroup: group1,
    });
    const [ parent2, listValue2 ] = useDragAndDrop<number, HTMLDivElement>([6, 7, 8, 9, 10],{
        droppableGroup: group2,
        direction: "horizontal",
    });
    return (
        <div className="group-list bg-[var(--sl-color-gray-6)]">
            <ul ref={parent} className="number-list">
                {listValue.map((element, index) => (
                    <li className="number" data-index={index} key={element}>
                        {element}
                    </li>
                ))}
            </ul>
            <div ref={parent2} className="number-list-h">
                {listValue2.map((element, index) => (
                    <div className="number" data-index={index} key={element}>
                        {element}
                    </div>
                ))}
            </div>
        </div>
    )
};
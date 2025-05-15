import { useDragAndDrop } from "fluid-dnd/react";
import './css/OnDragEvents.css'
import { useRef, useState } from "react";
import { type DragEndEventData, type DragStartEventData } from "fluid-dnd";

export const OnDragEventsWithMoreInfo: React.FC = () => {
    const droppableGroup = useRef<HTMLDivElement>(null)
    const [draggedElement, setDraggedElement] = useState<number>()
    const [lastDroppedElement, setLastDroppedElement] = useState<number>()
    function onDragStart(data: DragStartEventData<number>){
        setDraggedElement(data.value);
        const droppables = droppableGroup.current?.querySelectorAll('.droppable-group-group1')??[]
        for (const droppable of [...droppables]) {
        droppable.classList.toggle('marked-droppable',true)
        }
    }
    function onDragEnd (data: DragEndEventData<number>){
        setLastDroppedElement(data.value);
        const droppables = droppableGroup.current?.querySelectorAll('.droppable-group-group1')??[]
        for (const droppable of [...droppables]) {
        droppable.classList.toggle('marked-droppable',false)
        }
    }
    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3, 4, 5],{
        droppableGroup: 'group1',
        onDragStart,
        onDragEnd,
    });
    const [ parent2, listValue2 ] = useDragAndDrop<number, HTMLDivElement>([6, 7, 8, 9, 10],{
        droppableGroup: 'group1',
        direction: "horizontal",
        onDragStart,
        onDragEnd,
    });
    return (
        <>
            <div className="my-6">
                <h4 className="!text-accent-200/70">Dragged element: <span className="!text-[var(--sl-color-white)]">{ draggedElement }</span></h4>
                <h4 className="!text-accent-200/70">Last dropped element: <span className="!text-[var(--sl-color-white)]">{ lastDroppedElement }</span></h4>
            </div>
            <div ref={droppableGroup} className="group-list bg-[var(--sl-color-gray-6)]">
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
        </>
    )
};
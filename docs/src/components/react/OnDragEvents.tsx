import { useDragAndDrop } from "fluid-dnd/react";
import './css/OnDragEvents.css'
import { useRef } from "react";

export const OnDragEvents: React.FC = () => {
    const droppableGroup = useRef<HTMLDivElement>(null)
    function onDragStart(){
      const droppables = droppableGroup.current?.querySelectorAll('.droppable-group-group1')??[]
      for (const droppable of [...droppables]) {
        droppable.classList.toggle('marked-droppable',true)
      }
    }
    function onDragEnd (){
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
    )
};
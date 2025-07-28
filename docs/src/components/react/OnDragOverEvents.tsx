import { useDragAndDrop } from "fluid-dnd/react";
import './css/OnDragEvents.css'
import { useRef, useState } from "react";
import { type DragOverEventData } from "../../../../src/core";

export const OnDragOverEvents: React.FC = () => {
    const droppableGroup = useRef<HTMLDivElement>(null)
    const [currentDragOver, setCurrentDragOver] = useState<string>('')

    function onDragStart(){
      const droppables = droppableGroup.current?.querySelectorAll('.droppable-group-group1')??[]
      for (const droppable of [...droppables]) {
        droppable.classList.toggle('marked-droppable',true)
      }
      setCurrentDragOver('')
    }

    function onDragEnd (){
      const droppables = droppableGroup.current?.querySelectorAll('.droppable-group-group1')??[]
      for (const droppable of [...droppables]) {
        droppable.classList.toggle('marked-droppable',false)
      }
      setCurrentDragOver('')
    }

    function onDragOver(data: DragOverEventData<number>){
      const droppableElement = data.droppable as HTMLElement
      const droppableId = droppableElement.id || 'Unknown'
      setCurrentDragOver(`Dragging ${data.value} over ${droppableId} at position ${data.targetIndex}`)
    }

    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3, 4],{
        droppableGroup: 'group1',
        onDragStart,
        onDragEnd,
        onDragOver,
    });
    const [ parent2, listValue2 ] = useDragAndDrop<number, HTMLDivElement>([5, 6, 7, 8],{
        droppableGroup: 'group1',
        direction: "horizontal",
        onDragStart,
        onDragEnd,
        onDragOver,
    });

    return (
        <>
            <div className="my-6">
                <h4>Current drag over: <span className="!text-[var(--sl-color-white)]">{currentDragOver || 'None'}</span></h4>
            </div>
            <div ref={droppableGroup} className="group-list bg-[var(--sl-color-gray-6)]">
                <h5 className="mb-2">List 1</h5>
                <ul ref={parent} id="list1" className="number-list">
                    {listValue.map((element, index) => (
                        <li className="number" data-index={index} key={element}>
                            {element}
                        </li>
                    ))}
                </ul>
                <h5 className="mb-2">List 2</h5>
                <div ref={parent2} id="list2" className="number-list-h">
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
import { useDragAndDrop } from "fluid-dnd/react";
import './css/GroupNumber.css'
import './css/DroppableStyles.css'
export const DroppableStyles: React.FC = () => {
    const [ parent, listValue ] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3, 4, 5],{
        droppableGroup: 'group1',
        droppableClass: 'droppable-hover'
    });
    const [ parent2, listValue2 ] = useDragAndDrop<number, HTMLDivElement>([6, 7, 8, 9, 10],{
        droppableGroup: 'group1',
        direction: "horizontal",
        droppableClass: 'droppable-hover'
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
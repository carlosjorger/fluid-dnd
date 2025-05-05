import { useDragAndDrop } from "fluid-dnd/react";
import './css/InsertNumbers.css'
type Props = {
  insertingFromClass?: string;
  delayBeforeInsert?: number;
}
export const ListWithInsert: React.FC<Props> = ({insertingFromClass , delayBeforeInsert}) => {
    const [ parent, listValue, ,insertAt   ] = useDragAndDrop<number, HTMLUListElement>([],{
      insertingFromClass,
      delayBeforeInsert
    });
    return (
      <>
        <ul ref={parent} className="number-list p-8 bg-[var(--sl-color-gray-6)]">
            {listValue.map((element, index) => (
                <li className="number" data-index={index} key={element}>
                    {element}
                </li>
            ))}
        </ul>
        <button className="insert-button mx-5 bg-slate-100 rounded-2xl w-12" onClick={()=>insertAt(listValue.length, listValue.length)}>+</button>
      </>
    )
};
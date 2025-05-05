import { useDragAndDrop } from "fluid-dnd/react";
import './Number.css'
export const SingleVerticalListWithDiferentStyles: React.FC = () => {
    type ItemWitheStyle={
        id: string,
        style: React.CSSProperties,
        content: string
    }
    const [ parent, listValue ] = useDragAndDrop<ItemWitheStyle, HTMLUListElement>([
        {
            id: "1",
            style:
              { margin: "30px 0px", borderStyle: "solid", borderWidth: "0.8rem", padding: "5px"},
            content: "1",
          },
          {
            id: "2",
            style:
              { margin: "20px 0px", borderStyle: "solid", borderWidth: "0.6rem", padding: "10px"},
            content: "2",
          },
          {
            id: "3",
            style:
              {margin: "10px 0px", borderStyle: "solid", borderWidth: "0.4rem", padding: "15px"},  
            content: "3",
          },
    ]);
    return (
        <ul ref={parent} className="block px-2 h-72">
            {listValue.map((element, index) => (
                <li className="border-solid pl-1 mt-1 border-2" data-index={index} key={element.id} style={element.style}>
                    {element.content}
                </li>
            ))}
        </ul>
    )
};
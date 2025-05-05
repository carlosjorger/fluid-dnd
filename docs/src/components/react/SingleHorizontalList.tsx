import { useDragAndDrop } from "fluid-dnd/react";
export const SingleHorizontalList: React.FC = () => {
    const [ parent, listValue ] = useDragAndDrop<number, HTMLDivElement>([1, 2, 3, 4, 5],{
        direction: "horizontal"
    });
    return (
        <div ref={parent} className="solid flex p-5">
            {listValue.map((element, index) => (
                <div className="solid mt-4 border-2 p-9" data-index={index} key={element}>
                    {element}
                </div>
            ))}
        </div>
    )
};
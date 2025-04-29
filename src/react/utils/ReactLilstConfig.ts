import { RefObject, useEffect, useRef, useState } from "react";
import { CoreConfig, ListCondig } from "../../core";
import { insertToListEmpty as insertToListEmptyEvent } from "../../core/utils/events/emitEvents";

export function useReactListConfig<T,E extends HTMLElement>(items: T[], parent: RefObject<E>){
    const [itemsState, setItemsState] = useState(items);
    const stateRef = useRef(itemsState);
    useEffect(() => {
        stateRef.current = itemsState;
    }, [itemsState]);
    function removeAtEvent(index: number) {
        const deletedItem = stateRef.current[index];
        setItemsState(prevItems => [
            ...prevItems.slice(0, index),
            ...prevItems.slice(index + 1)
        ]);
        return deletedItem;
    };
   function insertEvent (index: number, value: T) {
        setItemsState(prevItems => {
            return [
                ...prevItems.slice(0, index),
                value,
                ...prevItems.slice(index)
              ]
        });
    };
    function getLength(){
        return itemsState.length;
    };
    function getValue(index:number){
        return itemsState[index]
    }
    function insertToListEmpty(config: CoreConfig<T>,index:number, value: T){ 
        insertToListEmptyEvent(config, parent.current ,index, value)
    }
    const action:ListCondig<T> = {
        removeAtEvent,
        insertEvent,
        getLength,
        getValue,
        insertToListEmpty
    }
    return [itemsState, setItemsState, action] as const 
}
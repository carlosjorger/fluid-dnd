import { ListCondig } from "..";
import {
  Config,
  CoreConfig,
  VERTICAL,
} from "..";
import { DRAGGABLE_CLASS } from "./classes";

export const getConfig = <T>(listCondig: ListCondig<T>,
  config?: Config<T>
): CoreConfig<T> => {
  
  const onRemoveAtEvent =(index: number) =>{
    return listCondig.removeAtEvent(index)
  };
  
  const onInsertEvent = (index: number, value: T) =>{
    return listCondig.insertEvent(index, value)
  };
  
  const onGetLegth =()=>{
    return listCondig.getLength()
  };
  
  const onGetValue = (index: number)=> {
    return listCondig.getValue(index)
  };
  
  return {
    direction: config?.direction ?? VERTICAL,
    handlerSelector: config?.handlerSelector ?? DRAGGABLE_CLASS,
    draggingClass: config?.draggingClass ?? "dragging",
    droppableClass: config?.droppableClass ?? 'droppable-hover',
    isDraggable: config?.isDraggable ?? (() => true),
    onDragStart: config?.onDragStart ?? (() => {}),
    onDragEnd: config?.onDragEnd ?? (() => {}),
    droppableGroup: config?.droppableGroup,
    onRemoveAtEvent,
    onInsertEvent,
    onGetLegth,
    onGetValue,
    animationDuration: config?.animationDuration ?? 200,
    removingClass: config?.removingClass ?? "removing",
    insertingFromClass: config?.insertingFromClass ?? 'from-inserting',
    delayBeforeRemove: config?.delayBeforeRemove ?? 200,
    delayBeforeInsert: config?.delayBeforeInsert ?? 200
  };
};

export const START_DRAG_EVENT = 'startDrag';
export const DRAG_EVENT = 'drag';
export const START_DROP_EVENT = 'startDrop';
export const DROP_EVENT = 'drop';
export const TEMP_CHILD_CLASS = 'temp-child';
export const draggableTargetTimingFunction = 'cubic-bezier(0.2, 0, 0, 1)';
export type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
export type DropEvent = typeof DROP_EVENT | typeof START_DROP_EVENT;
export type DragAndDropEvent = DraggingEvent | DropEvent | 'remove' | 'insert';
export const IsDropEvent = (event: DragAndDropEvent): event is DropEvent => {
	return event === DROP_EVENT || event === START_DROP_EVENT;
};
export const NONE_TRANSLATE = { height: 0, width: 0 };

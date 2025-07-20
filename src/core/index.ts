export type DraggableElement = { index: number; draggableId: string } | { index: number };
export type ListCondig<T> = {
	removeAtEvent: (index: number, sync?: boolean) => T | undefined;
	insertEvent: (index: number, value: T, sync?: boolean) => void;
	getLength: () => number;
	getValue: (index: number) => T;
	insertToListEmpty: (config: CoreConfig<T>, index: number, value: T) => void;
};
export type MapFrom<T> = (object: T, droppable: Element) => unknown;
export interface DragStartEventData<T> {
	index: number;
	element: Element;
	value: T;
}

export interface DragEndEventData<T> {
	index: number;
	value: T;
}
export const HORIZONTAL = 'horizontal';
export const VERTICAL = 'vertical';
/**
 * The direction of the list to sort.
 * @public
 */
export type Direction = typeof HORIZONTAL | typeof VERTICAL;
/**
 * The coordinate of the translate property of the draggred element.
 */
export type Coordinate = { x: number; y: number };
/**
 * Mapping function that transforms the coordinates of the dragged element.
 */
export type CoordinateMap = (coordinate: Coordinate, currentElement: HTMLElement) => Coordinate;
/**
 * Configuration of the drag and drop.
 * @public
 */
export interface Config<T> {
	/**
	 * The direction of the list to sort.
	 */
	direction?: Direction;
	/**
	 * The CSS selector of the drag handler element inside of the draggable element.
	 */
	handlerSelector?: string;
	/**
	 * The CSS class that is setted when a element is dragged.
	 */
	draggingClass?: string;
	/**
	 * The CSS class that is setted on a droppable element when the current element is dragged over it.
	 */
	droppableClass?: string;
	/**
	 * The CSS class that is setted when a element is removed.
	 */
	removingClass?: string;
	/**
	 * The CSS class that is setted when a element is start inserting.
	 */
	insertingFromClass?: string;
	/**
	 * Delay time before removing an element in milisecond.
	 */
	delayBeforeRemove?: number;
	/**
	 * Delay time before inserting an element in milisecond.
	 */
	delayBeforeInsert?: number;
	/**
	 * A function that returns whether a given element of the list is draggable.
	 */
	isDraggable?: (element: HTMLElement) => boolean;
	/**
	 * A function that returns whether a given element of the list is draggable.
	 */
	onDragStart?: (element: DragStartEventData<T>) => void;
	/**
	 * A function that returns whether a given element of the list is draggable.
	 */
	onDragEnd?: (element: DragEndEventData<T>) => void;
	/**
	 * Name of the group of the share droppables.
	 */
	droppableGroup?: string;
	/**
	 * The duration of the animations in milisecond.
	 */
	animationDuration?: number;
	/**
	 * Map value when is passed from the current list to another.
	 */
	mapFrom?: MapFrom<T>;
	/**
	 * The delay before the touchmove event is fired.
	 */
	delayBeforeTouchMoveEvent?: number;
	/**
	 * List of mapping functions that transform the coordinates of the dragged element, which are applied one after another,
	 * where the output of one mapping function becomes the input of the next.
	 * @example
	 * [map1, map2, map3]
	 * means:
	 * let y1 = map1(y0)
	 * let y2 = map2(y1)
	 * let finalCoordinate = map3(y2)
	 * The default value is [(coordinate) => coordinate]
	 * @default [(coordinate) => coordinate]
	 */
	coordinateTransform?: CoordinateMap[];
}
/**
 * onDrop event function.
 * @public
 */
export type OnDropEvent = (source: DraggableElement, destination: DraggableElement) => void;

export type OnRemoveAtEvent<T> = (index: number, sync?: boolean) => T | undefined;
export type OnInsertEvent<T> = (index: number, value: T, sync?: boolean) => void;
export type OnGetLength = () => number;
export type OnGetValue<T> = (index: number) => T;

export type CoreConfig<T> = {
	/**
	 * The direction of the list to sort.
	 */
	direction: Direction;
	/**
	 * The CSS selector of the drag handler element inside of the draggable element.
	 */
	handlerSelector: string;
	/**
	 * The CSS class that is setted when a element is dragged.
	 */
	draggingClass: string;
	/**
	 * The CSS class that is setted on a droppable element when the current element is dragged over it.
	 */
	droppableClass: string;
	/**
	 * The CSS class that is setted when a element is removed.
	 */
	removingClass: string;
	/**
	 * The CSS class that is setted when a element is start inserting.
	 */
	insertingFromClass: string;
	/**
	 * Delay time before removing an element in milisecond.
	 */
	delayBeforeRemove: number;
	/**
	 * Delay time before inserting an element in milisecond.
	 */
	delayBeforeInsert: number;
	/**
	 * A function that returns whether a given element of the list is draggable
	 */
	isDraggable: (element: HTMLElement) => boolean;
	/**
	 * A function that is called when the draggable element starts being dragged.
	 */
	onDragStart: (element: DragStartEventData<T>) => void;
	/**
	 * A function that is called when the draggable element is dropped.
	 */
	onDragEnd: (element: DragEndEventData<T>) => void;
	/**
	 * Name of the group of the share droppables
	 */
	droppableGroup?: string;
	/**
	 * The duration of the animations in milisecond
	 */
	animationDuration: number;
	onRemoveAtEvent: OnRemoveAtEvent<T>;
	onInsertEvent: OnInsertEvent<T>;
	onGetLegth: OnGetLength;
	onGetValue: OnGetValue<T>;
	/**
	 * Map value when is passed from the current list to another.
	 */
	mapFrom: MapFrom<T>;
	/**
	 * The delay before the touchmove event is fired.
	 */
	delayBeforeTouchMoveEvent: number;
	/**
	 * List of mapping functions that transform the coordinates of the dragged element, which are applied one after another,
	 * where the output of one mapping function becomes the input of the next.
	 * @example
	 * [map1, map2, map3]
	 * means:
	 * let y1 = map1(y0)
	 * let y2 = map2(y1)
	 * let finalCoordinate = map3(y2)
	 * The default value is [(coordinate) => coordinate]
	 * @default [(coordinate) => coordinate]
	 */
	coordinateTransform: CoordinateMap[];
};
export enum DraggingState {
	NOT_DRAGGING,
	START_DRAGGING,
	DRAGING,
	END_DRAGGING
}

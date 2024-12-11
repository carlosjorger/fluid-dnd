import { DraggableElement } from "index";

export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";
/**
 * The direction of the list to sort.
 * @public
 */
export type Direction = typeof HORIZONTAL | typeof VERTICAL;
/**
 * Configuration of the drag and drop.
 * @public
 */
export interface Config {
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
   * The CSS class that is setted when a element is removed.
   */
  removingClass?: string;
  /**
   * Delay time before removing an element in milisecond.
   */
  delayBeforeRemove?: number;
  /**
   * A function that returns whether a given element of the list is draggable.
   */
  isDraggable?: (element: HTMLElement) => boolean;
  /**
   * Name of the group of the share droppables.
   */
  droppableGroup?: string;
  /**
   * The duration of the animations in milisecond.
   */
  animationDuration?: number;
    /**
   * A function that return whether a given element of the list is cloned when is dragged
   */
  clone?: (element: HTMLElement) => boolean;
}
/**
 * onDrop event function.
 * @public
 */
export type OnDropEvent = (
  source: DraggableElement,
  destination: DraggableElement
) => void;

export type OnRemoveAtEvent<T> = (index: number) => T | undefined;
export type OnInsertEvent<T> = (index: number, value: T) => void;

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
   * The CSS class that is setted when a element is removed.
   */
  removingClass: string;
  /**
   * Delay time before removing an element in milisecond.
   */
  delayBeforeRemove: number;
  /**
   * A function that returns whether a given element of the list is draggable
   */
  isDraggable: (element: HTMLElement) => boolean;
  /**
   * Name of the group of the share droppables
   */
  droppableGroup?: string;
  /**
   * The duration of the animations in milisecond
   */
  animationDuration: number;
  /**
   * A function that return whether a given element of the list is cloned when is dragged
   */
  clone: (element: HTMLElement) => boolean;
  onRemoveAtEvent: OnRemoveAtEvent<T>;
  onInsertEvent: OnInsertEvent<T>;
};

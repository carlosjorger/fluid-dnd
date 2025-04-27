import ConfigHandler, { DroppableConfig } from "../configHandler";
import { DragMouseTouchEvent } from "../../../index";
import { draggableIsOutside } from "./GetStyles";
import { IsHTMLElement } from "./touchDevice";
import { setEventWithInterval } from "./SetStyles";
import { getClassesSelector } from "./dom/classList";
import { MapConfig } from "./config";
import { MapFrom } from "..";

export class DroppableConfigurator<T>{
  initial: DroppableConfig<any> | undefined;
  current: DroppableConfig<T> | undefined;
  private parent: HTMLElement;
  private draggableElement: HTMLElement;
  private groupClass: string | null;
  private dragEvent: () => void;
  private changeDroppable: (newdDroppableConfig: DroppableConfig<T> | undefined, oldDroppableConfig: DroppableConfig<T> | undefined) => void
  private  mapFrom: MapFrom<T>;
  constructor(
    draggableElement: HTMLElement,
    droppableGroupClass: string | null,
    parent: HTMLElement,
    setTransformDragEvent: () => void,
    changeDroppable: (newdDroppableConfig: DroppableConfig<T> | undefined, oldDroppableConfig: DroppableConfig<T> | undefined) => void, 
    mapFrom: MapFrom<T>
  ) {
    this.parent = parent;
    this.draggableElement = draggableElement;
    this.groupClass = droppableGroupClass;
    this.dragEvent = setTransformDragEvent;
    this.mapFrom = mapFrom;
    this.initial = parent? ConfigHandler.getConfig(parent): undefined;
    this.changeDroppable = changeDroppable;
  }
  private getDraggableAncestor(
    clientX: number,
    clientY: number,
    draggable: Element | null
  ) {
    return document
      .elementsFromPoint(clientX, clientY)
      .filter((element) => !element.isSameNode(draggable));
  }
  private getElementBelow(
    currentElement: HTMLElement,
    event: DragMouseTouchEvent,
    hiddenDraggable: boolean = true){
      const getElementBelow = (config: DroppableConfigurator<T>) => {
        const [elementBelow] = config.getDraggableAncestor(
          event.clientX,
          event.clientY,
          currentElement
        );
        return elementBelow
      }
      let elementBelow = null
      if (hiddenDraggable) {
        currentElement.hidden = true;
        elementBelow = getElementBelow(this)
        currentElement.hidden = false;
      }
      else{
        elementBelow = getElementBelow(this)
      }
      return elementBelow
  }
  private getCurrent(
    currentElement: HTMLElement,
    event: DragMouseTouchEvent,
    hiddenDraggable: boolean = true
  ) {
    const elementBelow = this.getElementBelow(currentElement, event, hiddenDraggable)
    if (!this.groupClass || !elementBelow) {
      return;
    }
    const currentDroppable = elementBelow.closest(
      getClassesSelector(this.groupClass)
    );
    return currentDroppable;
  }
  private isOutsideOfAllDroppables(currentElement: HTMLElement) {
    const droppables = this.groupClass? Array.from(
      document.querySelectorAll(getClassesSelector(this.groupClass))
    ):[this.parent];
    return droppables.every((droppable) =>
      draggableIsOutside(currentElement, droppable)
    );
  }
  private isNotInsideAnotherDroppable(
    currentElement: HTMLElement,
    droppable: HTMLElement
  ) {
    const isOutside = draggableIsOutside(currentElement, droppable);
    return !isOutside || this.isOutsideOfAllDroppables(currentElement);
  }
  private onScrollEvent() {
    this.dragEvent();
  };
  private setOnScroll(droppable: Element) {
    setEventWithInterval(droppable, "onscroll",()=> { this.onScrollEvent() });
  }
  getConfigFrom(element: Element) {
    const coreConfig = ConfigHandler.getConfig(element);
    if (!coreConfig) {
      return undefined
    }
    return {
      ...coreConfig,
      config: MapConfig(coreConfig, this.mapFrom)
    }
  }
  getCurrentConfig(event: DragMouseTouchEvent) {
    const currentElement = this.draggableElement;
    if (
      this.current &&
      this.isNotInsideAnotherDroppable(
        currentElement,
        this.current?.droppable
      )
    ) {
      return this.current;
    }
    const currentDroppable = this.getCurrent(currentElement, event);
    if (!currentDroppable) {
      return this.getConfigFrom(this.parent);
    }
    if (IsHTMLElement(currentDroppable) && !currentDroppable.onscroll) {
      this.setOnScroll(currentDroppable);
    }
    return this.getConfigFrom(currentDroppable);
  }
  updateConfig(event: DragMouseTouchEvent) {
    const oldDroppableConfig = this.current;
    this.current = this.getCurrentConfig(event);
    this.changeDroppable(this.current, oldDroppableConfig)
  }
  isOutside(event: DragMouseTouchEvent, hiddenDraggable: boolean = true){
    const currentElement = this.draggableElement;
    return !Boolean(this.getCurrent(currentElement, event, hiddenDraggable))
  }
}

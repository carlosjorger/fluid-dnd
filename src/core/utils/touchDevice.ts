export const isTouchEvent = (
  event: MouseEvent | TouchEvent
): event is TouchEvent => window.TouchEvent && event instanceof TouchEvent;

export const IsHTMLElement = (
  element: Element| Node | undefined
): element is HTMLElement => element instanceof HTMLElement;

export const IsMouseEvent = (
  event: MouseEvent | TouchEvent
): event is MouseEvent => event instanceof MouseEvent;
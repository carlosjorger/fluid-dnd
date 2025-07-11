import { draggableTargetTimingFunction } from '.';
import { CoreConfig, Direction, HORIZONTAL, VERTICAL } from '..';
import { DragMouseTouchEvent, fixedSize } from '../../../index';
import { getPositionWithBorder, getPropByDirection, getRect } from './GetStyles';
import { IsHTMLElement, IsMouseEvent, isTouchEvent } from './typesCheckers';

type onTouchEvent = 'ontouchstart' | 'ontouchmove' | 'ontouchend';
const onMouseEvents = ['onmouseup', 'onmousedown', 'onmousemove'] as const;
type onMouseEvent = (typeof onMouseEvents)[number];

type TouchEventType = 'touchstart' | 'touchmove' | 'touchend';
const mouseEvents = ['mouseup', 'mousedown', 'mousemove'] as const;
type MouseEventType = (typeof mouseEvents)[number];
type DragEventCallback = (event: DragMouseTouchEvent) => void;
type TouchEventCallback = (event: TouchEvent) => void;
export const TRANSLATE_X = '--translate-x';
export const TRANSLATE_Y = '--translate-y';
export const setSizeStyles = (
	element: HTMLElement | undefined | null,
	height: number,
	width: number
) => {
	if (!element) {
		return;
	}
	element.style.height = `${height}px`;
	element.style.width = `${width}px`;
};

export const fixSizeStyle = (element: HTMLElement | undefined | null) => {
	if (!element) {
		return;
	}
	const { height, width } = getRect(element);
	setSizeStyles(element, height, width);
};

const assignDraggingTouchEvent = (
	element: HTMLElement,
	onEvent: onTouchEvent,
	callback: DragEventCallback,
	touchCallback?: TouchEventCallback
) => {
	element[onEvent] = (event: TouchEvent) => {
		if (event.defaultPrevented) {
			return;
		}
		touchCallback && touchCallback(event);
		const dragMouseTouchEvent = convetEventToDragMouseTouchEvent(event);
		callback(dragMouseTouchEvent);
	};
};
export const assignDraggingEvent = (
	element: HTMLElement,
	onEvent: onMouseEvent | onTouchEvent,
	callback: DragEventCallback | null,
	touchCallback?: TouchEventCallback
) => {
	if (!callback) {
		return;
	}
	if (isOnMouseEvent(onEvent)) {
		element[onEvent] = callback;
	} else {
		assignDraggingTouchEvent(element, onEvent, callback, touchCallback);
	}
};
export const addDragMouseToucEventListener = (
	event: TouchEventType | MouseEventType,
	callback: DragEventCallback | null
) => {
	if (!callback) {
		return;
	}
	if (isMouseEvent(event)) {
		document.addEventListener(event, callback);
	} else {
		document.addEventListener(event, (event: TouchEvent) => {
			const dragMouseTouchEvent = convetEventToDragMouseTouchEvent(event);
			callback(dragMouseTouchEvent);
		});
	}
};

const isOnMouseEvent = (x: any): x is onMouseEvent => onMouseEvents.includes(x);
const isMouseEvent = (x: any): x is MouseEventType => mouseEvents.includes(x);
const getDefaultEvent = (event: TouchEvent | MouseEvent) => {
	const { target } = event;
	return {
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		screenX: 0,
		screenY: 0,
		target,
		offsetX: 0,
		offsetY: 0
	};
};
const getOffsetFromEvent = (event: MouseEvent | TouchEvent, tempEvent: MouseEvent | Touch) => {
	const getTouchEventOffset = (element: Element, direction: Direction) => {
		return getOffset(tempEvent, window, direction, element);
	};
	if (IsMouseEvent(event)) {
		const { offsetX, offsetY } = event;
		return [offsetX, offsetY] as const;
	} else {
		const element = event.target as Element;
		return [
			getTouchEventOffset(element, HORIZONTAL),
			getTouchEventOffset(element, VERTICAL)
		] as const;
	}
};
export const convetEventToDragMouseTouchEvent = (
	event: MouseEvent | TouchEvent
): DragMouseTouchEvent => {
	const tempEvent = getEvent(event);
	if (!tempEvent) {
		return getDefaultEvent(event);
	}

	const [offsetX, offsetY] = getOffsetFromEvent(event, tempEvent);
	const { clientX, clientY, pageX, pageY, screenX, screenY, target } = tempEvent;

	return {
		clientX,
		clientY,
		pageX,
		pageY,
		screenX,
		screenY,
		target,
		offsetX,
		offsetY
	};
};
const getEvent = (event: MouseEvent | TouchEvent) => {
	if (isTouchEvent(event)) {
		return event.touches[0] ?? event.changedTouches[0];
	}
	if (IsMouseEvent(event)) {
		return event;
	}
};
const getOffset = (
	event: MouseEvent | Touch,
	window: Window,
	direction: Direction,
	element: Element
) => {
	const { page, scroll } = getPropByDirection(direction);
	const positionWithBorder = getPositionWithBorder(element, direction);
	return event[page] - window[scroll] - positionWithBorder;
};
export const setTranistion = (
	element: Element | undefined,
	duration: number,
	timingFunction: string = 'ease-out',
	types: string = 'transform'
) => {
	if (IsHTMLElement(element)) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transitionTimingFunction = `${timingFunction}`;
		element.style.transitionProperty = `${types}`;
	}
};
export const setEventWithInterval = (
	element: Element | undefined,
	eventName: 'onscroll',
	callback: () => void
) => {
	if (!element || !IsHTMLElement(element)) {
		return;
	}
	element[eventName] = () => {
		callback();
	};
};
const getStyles = (node: ParentNode) => {
	var style = node.querySelector('style');
	if (!style) {
		var newStyle = document.createElement('style');
		node.appendChild(newStyle);
		return newStyle;
	}
	return style;
};
const containRule = (sheet: CSSStyleSheet, cssCode: string) => {
	const selectorTextRegex = /\.-?[_a-zA-Z0-9-*\s<>():]+/g;
	const [selectorText] = cssCode.match(selectorTextRegex) || [];
	for (const rule of sheet.cssRules) {
		const [ruleSelectorText] = rule.cssText.match(selectorTextRegex) || [];
		if (selectorText === ruleSelectorText) {
			return true;
		}
	}
	return false;
};
export const AddCssStylesToElement = (node: ParentNode, cssCodes: string[]) => {
	cssCodes.forEach((cssCode) => {
		AddCssStyleToElement(node, cssCode);
	});
};

const AddCssStyleToElement = (node: ParentNode, cssCode: string) => {
	var style = getStyles(node);
	if (!style.sheet) {
		return;
	}
	if (!containRule(style.sheet, cssCode)) {
		style.sheet?.insertRule(cssCode, style.sheet.cssRules.length);
	}
};
export const setCustomFixedSize = (
	element: HTMLElement | undefined,
	fixedProps: fixedSize = {}
) => {
	for (const fixedProp of Object.keys(fixedProps) as Array<keyof fixedSize>) {
		const fixedValue = fixedProps[fixedProp];
		if (fixedValue != undefined) {
			setCustomProperty(element, `--${fixedProp}`, fixedValue);
		}
	}
};
const setCustomProperty = (
	element: HTMLElement | undefined,
	fixedProp: string,
	newFixedSize: string
) => {
	return element && element.style.setProperty(fixedProp, newFixedSize);
};
export const getTranslate = (direction: Direction, element: HTMLElement) => {
	const tranlateProp = direction == HORIZONTAL ? TRANSLATE_X : TRANSLATE_Y;
	const currentTranslate = parseFloat(element.style.getPropertyValue(tranlateProp) || '0');
	return currentTranslate;
};
export function addTranslate(element: Element, x: number, y: number) {
	if (!IsHTMLElement(element)) {
		return;
	}
	const currentTranslateX = getTranslate(HORIZONTAL, element);
	const currentTranslateY = getTranslate(VERTICAL, element);
	setTranslate(element, currentTranslateX + x, currentTranslateY + y);
}
export function removeTranslate(element: Element) {
	if (!IsHTMLElement(element)) {
		return;
	}
	element.style.removeProperty(TRANSLATE_X);
	element.style.removeProperty(TRANSLATE_Y);
	element.style.transform = '';
	element.style.transition = '';
}
export function setTranslate(element: Element, x: number, y: number) {
	if (!IsHTMLElement(element)) {
		return;
	}
	element.style.setProperty(TRANSLATE_X, x + 'px');
	element.style.setProperty(TRANSLATE_Y, y + 'px');
	element.style.transform = `translate(var(${TRANSLATE_X}, 0), var(${TRANSLATE_Y}, 0))`;
}
export function setTranslateWithTransition<T>(
	currentConfig: CoreConfig<T>,
	element: Element,
	x: number,
	y: number
) {
	const { animationDuration } = currentConfig;
	setTranslate(element, x, y);
	setTranistion(element, animationDuration, draggableTargetTimingFunction);
}
export function setTranslateByDirection<T>(
	currentConfig: CoreConfig<T>,
	element: HTMLElement,
	translate: number
) {
	const { animationDuration, direction } = currentConfig;
	if (direction == HORIZONTAL) {
		setTranslate(element, translate, 0);
	} else {
		setTranslate(element, 0, translate);
	}
	setTranistion(element, animationDuration, draggableTargetTimingFunction);
}

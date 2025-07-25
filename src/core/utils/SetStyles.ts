import { NONE_TRANSLATE } from '.';
import { Direction, HORIZONTAL, VERTICAL } from '..';
import { DragMouseTouchEvent, fixedSize, Translate } from '../../../index';
import {
	getBefore,
	getBorderBeforeWidthValue,
	getPageValue,
	getRect,
	getScrollValue
} from './GetStyles';
import { IsHTMLElement, IsMouseEvent, isTouchEvent } from './typesCheckers';

type onTouchEvent = 'ontouchstart' | 'ontouchmove' | 'ontouchend';
const onMouseEvents = ['onmouseup', 'onmousedown', 'onmousemove'] as const;
type onMouseEvent = (typeof onMouseEvents)[number];

type DragEventCallback = (event: DragMouseTouchEvent) => void;
type TouchEventCallback = (event: TouchEvent) => void;

export const setSizeStyles = (element: HTMLElement, translate: Translate) => {
	element.style.height = `${translate.height}px`;
	element.style.width = `${translate.width}px`;
};

export const moveTranslate = (
	element: Element | undefined | null,
	translation: Translate = NONE_TRANSLATE
) => {
	if (!element || !IsHTMLElement(element)) {
		return;
	}
	if (translation.width == 0 && translation.height == 0) {
		element.style.transform = '';
	} else {
		element.style.transform = `translate(${translation.width}px,${translation.height}px)`;
	}
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

const isOnMouseEvent = (x: any): x is onMouseEvent => onMouseEvents.includes(x);
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
	const boundingClientRect = getRect(element);
	return (
		getPageValue(direction, event) -
		getScrollValue(direction, window) -
		getBefore(direction, boundingClientRect) -
		getBorderBeforeWidthValue(direction, element)
	);
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
	if (style.sheet && !containRule(style.sheet, cssCode)) {
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
export const removeTranslateWhitoutTransition = (element?: Element) => {
	if (IsHTMLElement(element)) {
		element.style.transition = '';
		element.style.transform = '';
	}
};

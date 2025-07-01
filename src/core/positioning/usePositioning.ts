import { Coordinate, DragMouseTouchEvent, ElementPosition, TransformEvent } from '../../../index';
import {
	getNearestFixedParentPosition,
	getPropByDirection,
	getValueFromProperty
} from '../utils/GetStyles';
import { CoordinateMap, Direction, HORIZONTAL, VERTICAL } from '..';
import { updateScrollByPosition } from './autoScroll';
import { HANDLER_CLASS, DRAGGING_CLASS } from '../utils/classes';
import { containClass } from '../utils/dom/classList';
import { setTranslate } from '../utils/SetStyles';

export const usePositioning = (
	coordinateTransforms: CoordinateMap[]
) => {
	let currentOffset = { offsetX: 0, offsetY: 0 };
	let position = { top: 0, left: 0 };
	let translate = { x: 0, y: 0 };
	const updateTranform = (newTranslate: Coordinate, element: HTMLElement) => {
		setTranslate(element,newTranslate.x, newTranslate.y)
	};
	const updatePosition = (newPosition: ElementPosition, element: HTMLElement) => {
		element.style.top = `${newPosition.top}px`;
		element.style.left = `${newPosition.left}px`;
	};
	const setTransform = (
		element: HTMLElement | undefined,
		parent: HTMLElement,
		pagePosition: {
			pageX: number;
			pageY: number;
		},
		direction?: Direction
	) => {
		if (!element) {
			return;
		}
		const getTranslateWihtDirection = (translateDirection: Direction) => {
			const {
				beforeMargin,
				borderBeforeWidth,
				before,
				offset,
				scroll,
				page,
				inner,
				distance,
				axis,
				getRect
			} = getPropByDirection(translateDirection);
			const pageValue = pagePosition[page];
			const scrollValue = window[scroll];
			const innerDistance = window[inner];
			const distanceValue = getRect(element)[distance];
			const [draggedElement] = element.children;
			const border = getValueFromProperty(draggedElement, borderBeforeWidth);
			const margin = getValueFromProperty(draggedElement, beforeMargin);
			const elementPosittion = pageValue - currentOffset[offset];

			const beforefixecParentValue = getNearestFixedParentPosition(element, translateDirection);
			if (
				elementPosittion >= scrollValue - distanceValue / 2 &&
				elementPosittion <= scrollValue + innerDistance
			) {
				const newTranslate =
					elementPosittion -
					position[before] -
					border -
					margin -
					scrollValue -
					beforefixecParentValue;
				updateScroll(translateDirection, draggedElement);
				return newTranslate;
			}
			const defaultTransalation = translate[axis];
			return defaultTransalation;
		};
		const updateScroll = (translateDirection: Direction, draggedElement: Element) => {
			if (element && containClass(element, DRAGGING_CLASS) && translateDirection === direction) {
				updateScrollByPosition(direction, parent, draggedElement ,position, translate);
			}
		};
		const updateTranlateByDirection = (direction: Direction) => {
			const { axis } = getPropByDirection(direction);
			translate[axis] = getTranslateWihtDirection(direction);

			updateTranform(mapCoordinate(element), element);
		};
		updateTranlateByDirection(HORIZONTAL);
		updateTranlateByDirection(VERTICAL);
	};
	const mapCoordinate = (element: HTMLElement) => {
		let coordinate = translate;
		for (const transform of coordinateTransforms) {
			coordinate = transform(coordinate, element);
		}
		return coordinate;
	};
	const updateTransformState = (
		event: DragMouseTouchEvent,
		element: HTMLElement,
		fixedElement: HTMLElement
	) => {
		const [top, left, offsetX, offsetY] = getTransformState(event, element);
		position = {
			top,
			left
		};
		updatePosition(position, fixedElement);
		currentOffset = { offsetX, offsetY };
	};
	return [setTransform, updateTransformState] as const;
};

const getOffsetWithDraggable = (direction: Direction, element: Element, draggable: Element) => {
	const { borderBeforeWidth, before, getRect } = getPropByDirection(direction);
	return (
		getRect(element)[before] -
		getRect(draggable)[before] -
		getValueFromProperty(draggable, borderBeforeWidth)
	);
};
const getOffset = (event: TransformEvent, draggable: Element) => {
	let { offsetX, offsetY, target } = event;
	let targetHandler = getHandlerElementAncestor(target, draggable);
	const targetElement = target as HTMLElement;
	if (targetElement && targetHandler && !targetElement.isSameNode(targetHandler)) {
		offsetX += getOffsetWithDraggable(HORIZONTAL, targetElement, targetHandler);
		offsetY += getOffsetWithDraggable(VERTICAL, targetElement, targetHandler);
	}
	if (targetHandler && draggable != target) {
		offsetX += getOffsetWithDraggable(HORIZONTAL, targetHandler, draggable);
		offsetY += getOffsetWithDraggable(VERTICAL, targetHandler, draggable);
	}
	return [offsetX, offsetY];
};
const getHandlerElementAncestor = (target: EventTarget | null, draggable: Element) => {
	const targetHandler = (target as Element)?.closest(`.${HANDLER_CLASS}`);
	if (targetHandler && targetHandler.isSameNode(draggable)) {
		return target as Element;
	}
	return targetHandler;
};
const getPositionByDistance = (
	direction: Direction,
	event: TransformEvent,
	element: HTMLElement,
	offsetEvent: {
		offsetX: number;
		offsetY: number;
	}
) => {
	const { offset, beforeMargin, page, borderBeforeWidth, scroll } = getPropByDirection(direction);

	const beforefixecParentValue = getNearestFixedParentPosition(element, direction);

	return (
		event[page] -
		offsetEvent[offset] -
		getValueFromProperty(element, beforeMargin) -
		getValueFromProperty(element, borderBeforeWidth) -
		window[scroll] -
		beforefixecParentValue
	);
};
export const getTransformState = (
	event: TransformEvent,
	element: HTMLElement
): [number, number, number, number] => {
	const [offsetX, offsetY] = getOffset(event, element);
	return [
		getPositionByDistance(VERTICAL, event, element, {
			offsetX,
			offsetY
		}),
		getPositionByDistance(HORIZONTAL, event, element, {
			offsetX,
			offsetY
		}),
		offsetX,
		offsetY
	];
};

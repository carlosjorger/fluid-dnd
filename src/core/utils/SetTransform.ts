import { Coordinate, DragMouseTouchEvent, ElementPosition, TransformEvent } from '../../../index';
import {
	getNearestFixedParentPosition,
	getPropByDirection,
	getValueFromProperty
} from './GetStyles';
import { CoordinateMap, Direction, HORIZONTAL, VERTICAL } from '..';
import { useScroll } from './scroll';
import { HANDLER_CLASS, DRAGGING_CLASS } from './classes';
import { containClass } from './dom/classList';

export const useTransform = (
	draggedElement: HTMLElement,
	coordinateTransforms: CoordinateMap[]
) => {
	let currentOffset = { offsetX: 0, offsetY: 0 };
	let position = { top: 0, left: 0 };
	let translate = { x: 0, y: 0 };
	const [updateScrollByPosition] = useScroll(draggedElement);
	const updateTranform = (newTranslate: Coordinate) => {
		draggedElement.style.transform = `translate( ${newTranslate.x}px, ${newTranslate.y}px)`;
	};
	const updatePosition = (newPosition: ElementPosition) => {
		draggedElement.style.top = `${newPosition.top}px`;
		draggedElement.style.left = `${newPosition.left}px`;
	};
	const setTransform = (
		element: HTMLElement,
		parent: HTMLElement,
		pagePosition: {
			pageX: number;
			pageY: number;
		},
		direction?: Direction
	) => {
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
			const border = getValueFromProperty(element, borderBeforeWidth);
			const margin = getValueFromProperty(element, beforeMargin);
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
				updateScroll(translateDirection);
				return newTranslate;
			}
			const defaultTransalation = translate[axis];
			return defaultTransalation;
		};
		const updateScroll = (translateDirection: Direction) => {
			if (element && containClass(element, DRAGGING_CLASS) && translateDirection === direction) {
				updateScrollByPosition(direction, parent, position, translate);
			}
		};
		const updateTranlateByDirection = (direction: Direction) => {
			const { axis } = getPropByDirection(direction);
			translate[axis] = getTranslateWihtDirection(direction);

			updateTranform(mapCoordinate());
		};
		updateTranlateByDirection(HORIZONTAL);
		updateTranlateByDirection(VERTICAL);
	};
	const mapCoordinate = () => {
		let coordinate = translate;
		for (const transform of coordinateTransforms) {
			coordinate = transform(coordinate, draggedElement);
		}
		return coordinate;
	};
	const updateTransformState = (event: DragMouseTouchEvent, element: HTMLElement) => {
		const [top, left, offsetX, offsetY] = getTransformState(event, element, draggedElement);
		position = {
			top,
			left
		};
		updatePosition(position);
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
	element: HTMLElement,
	draggable: Element
): [number, number, number, number] => {
	const [offsetX, offsetY] = getOffset(event, draggable);
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

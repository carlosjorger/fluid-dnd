import {
	Coordinate,
	DragMouseTouchEvent,
	ElementPosition,
	OffsetCoordinate,
	TransformEvent
} from '../../../index';
import {
	getAxisValue,
	getBefore,
	getBeforeMarginValue,
	getBorderBeforeWidthValue,
	getDistanceValue,
	getInnerDistance,
	getNearestParentPositionWithTranslate,
	getOffsetValue,
	getPageValue,
	getPropByDirection,
	getRect,
	getScrollValue,
	hasTransform,
	isSameNode
} from '../utils/GetStyles';
import { CoordinateMap, Direction, HORIZONTAL, VERTICAL } from '..';
import { useScroll } from './autoScroll';
import { HANDLER_CLASS, DRAGGING_CLASS } from '../utils/classes';
import { containClass } from '../utils/dom/classList';

export const usePositioning = (
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
	const updatePosition = (position: ElementPosition) => {
		draggedElement.style.top = `${position.top}px`;
		draggedElement.style.left = `${position.left}px`;
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
			const pageValue = getPageValue(translateDirection, pagePosition);
			const scrollValue = getScrollValue(translateDirection, window);
			const innerDistance = getInnerDistance(translateDirection, window);
			const [distanceValue] = getDistanceValue(translateDirection, getRect(element));
			const border = getBorderBeforeWidthValue(translateDirection, element);
			const margin = getBeforeMarginValue(translateDirection, element);
			const elementPosittion = pageValue - getOffsetValue(translateDirection, currentOffset);

			const beforefixecParentValue = getNearestParentPositionWithTranslate(element, translateDirection);
			if (
				elementPosittion >= scrollValue - distanceValue / 2 &&
				elementPosittion <= scrollValue + innerDistance
			) {
				const parentPosition = getParentPosition(translateDirection, parent);
				const newTranslate =
					elementPosittion -
					getBefore(translateDirection, position) -
					border -
					margin -
					scrollValue -
					beforefixecParentValue -
					parentPosition;
				updateScroll(translateDirection);
				return newTranslate;
			}
			const defaultTransalation = getAxisValue(translateDirection, translate);
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
		const [tempPosition, offset] = getTransformState(event, element, draggedElement);
		position = tempPosition;
		updatePosition(position);
		currentOffset = offset;
	};
	return [setTransform, updateTransformState] as const;
};

const getOffsetWithDraggable = (direction: Direction, element: Element, draggable: Element) => {
	return (
		getBefore(direction, getRect(element)) -
		getBefore(direction, getRect(draggable)) -
		getBorderBeforeWidthValue(direction, draggable)
	);
};
const getOffset = (event: TransformEvent, draggable: Element) => {
	let { offsetX, offsetY, target } = event;
	let targetHandler = getHandlerElementAncestor(target, draggable);
	const targetElement = target as HTMLElement;
	if (targetElement && targetHandler && !isSameNode(targetElement, targetHandler)) {
		offsetX += getOffsetWithDraggable(HORIZONTAL, targetElement, targetHandler);
		offsetY += getOffsetWithDraggable(VERTICAL, targetElement, targetHandler);
	}
	if (targetHandler && draggable != target) {
		offsetX += getOffsetWithDraggable(HORIZONTAL, targetHandler, draggable);
		offsetY += getOffsetWithDraggable(VERTICAL, targetHandler, draggable);
	}
	return { offsetX, offsetY };
};
const getHandlerElementAncestor = (target: EventTarget | null, draggable: Element) => {
	const targetHandler = (target as Element)?.closest(`.${HANDLER_CLASS}`);
	if (targetHandler && isSameNode(draggable, targetHandler)) {
		return target as Element;
	}
	return targetHandler;
};
const getPositionByDistance = (
	direction: Direction,
	event: TransformEvent,
	element: HTMLElement,
	offsetEvent: OffsetCoordinate
) => {
	const beforefixecParentValue = getNearestParentPositionWithTranslate(element, direction);
	const parent = element.parentElement;
	const parentPosition = getParentPosition(direction, parent);
	return (
		getPageValue(direction, event) -
		getOffsetValue(direction, offsetEvent) -
		getBeforeMarginValue(direction, element) -
		getBorderBeforeWidthValue(direction, element) -
		getScrollValue(direction, window) -
		beforefixecParentValue -
		parentPosition
	);
};
const getParentPosition = (direction: Direction, element: HTMLElement | null) => {
	return element && hasAncestorTransform(element) ? getBefore(direction, getRect(element)) : 0;
};
const hasAncestorTransform = (element: HTMLElement) => {
	let current: HTMLElement | null = element;
	while (current) {
		const currentElementHasTransform = hasTransform(current);
		if (currentElementHasTransform) {
			return true;
		}
		current = current.parentElement;
	}
	return false;
};
export const getTransformState = (
	event: TransformEvent,
	element: HTMLElement,
	draggable: Element
): [ElementPosition, OffsetCoordinate] => {
	const offset = getOffset(event, draggable);
	return [
		{
			top: getPositionByDistance(VERTICAL, event, element, offset),
			left: getPositionByDistance(HORIZONTAL, event, element, offset)
		},
		offset
	];
};

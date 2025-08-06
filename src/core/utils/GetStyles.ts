import { Direction, HORIZONTAL, VERTICAL } from '..';
import {
	BeforeMargin,
	AfterMargin,
	BorderWidth,
	PaddingBefore,
	Before,
	Translate,
	Coordinate,
	ElementPosition,
	ElementScroll,
	WindowScroll
} from '../../../index';
import { DRAGGABLE_CLASS } from './classes';
import { containClass } from './dom/classList';

export const getWindowScroll = () => {
	const { scrollX, scrollY } = window;
	return { scrollX, scrollY };
};
export const parseFloatEmpty = (value: string) => {
	if (!value || value.trim().length == 0 || value == 'normal') {
		return 0;
	}
	return parseFloat(value);
};
export const parseIntEmpty = (value: string | null) => {
	if (!value) {
		return -1;
	}
	return parseInt(value);
};

export const getTransform = (element: Element) => {
	const style = getComputedStyle(element);
	const matrix = new DOMMatrixReadOnly(style.transform);
	return {
		x: matrix.m41,
		y: matrix.m42
	};
};
const intersection = (
	firstInterval: { x1: number; x2: number },
	secondInterval: { x1: number; x2: number }
): number => {
	if (firstInterval.x1 > secondInterval.x1) {
		return intersection(secondInterval, firstInterval);
	}
	if (firstInterval.x2 < secondInterval.x1) {
		return 0;
	}
	if (firstInterval.x2 >= secondInterval.x2) {
		return firstInterval.x2 - firstInterval.x1;
	}
	return firstInterval.x2 - secondInterval.x1;
};
export const draggableIsOutside = (draggable: Element, droppable: Element) => {
	return !hasIntersection(draggable, droppable);
};
const hasIntersection = (element1: Element, element2: Element) => {
	const { intersectionX, intersectionY, rect1, rect2 } = getIntersection(element1, element2);

	return (
		intersectionY >= Math.min(rect1.height, rect2.height) / 2 &&
		intersectionX >= Math.min(rect1.width, rect2.width) / 2
	);
};
export const draggableIsCompleteOutside = (draggable: Element, droppable: Element) => {
	return !hasCompleteIntersection(draggable, droppable);
};
const hasCompleteIntersection = (element1: Element, element2: Element) => {
	const { intersectionX, intersectionY } = getIntersection(element1, element2);

	return intersectionY >= 0 && intersectionX >= 0;
};
const getIntersection = (element1: Element, element2: Element) => {
	const rect1 = getRect(element1);
	const rect2 = getRect(element2);

	const intersectionY = intersectionByDirection(rect1, rect2, VERTICAL);
	const intersectionX = intersectionByDirection(rect1, rect2, HORIZONTAL);
	return {
		rect1,
		rect2,
		intersectionX,
		intersectionY
	};
};
const intersectionByDirection = (rect1: DOMRect, rect2: DOMRect, direction: Direction) => {
	const { before, distance } = getPropByDirection(direction);
	return intersection(
		{
			x1: rect1[before],
			x2: rect1[before] + rect1[distance]
		},
		{
			x1: rect2[before],
			x2: rect2[before] + rect2[distance]
		}
	);
};
export const getValueFromProperty = (
	element: HTMLElement | Element | undefined | null,
	property: PaddingBefore | BorderWidth | BeforeMargin | AfterMargin | Before
) => {
	if (element) {
		return parseFloatEmpty(getComputedStyle(element)[property]);
	}
	return 0;
};
export const getScrollElement = (element: HTMLElement) => {
	const { scrollLeft, scrollTop } = element;
	return { scrollLeft, scrollTop };
};
export const getRect = (element: Element) => {
	return element.getBoundingClientRect();
};
export const getDistanceValue = (direction: Direction, translation: Translate) => {
	const { distance } = getPropByDirection(direction);
	return [translation[distance], distance] as const;
};
export const getAxisValue = (direction: Direction, coordinate: Coordinate) => {
	const { axis } = getPropByDirection(direction);
	return coordinate[axis];
};
export const getBorderBeforeWidthValue = (direction: Direction, element: Element) => {
	const { borderBeforeWidth } = getPropByDirection(direction);
	return getValueFromProperty(element, borderBeforeWidth);
};
export const getBeforeMarginValue = (direction: Direction, element: Element | null) => {
	const { beforeMargin } = getPropByDirection(direction);
	return getValueFromProperty(element, beforeMargin);
};

export const getBeforeMargin = (direction: Direction, element: Element | null) => {
	const { beforeMargin } = getPropByDirection(direction);
	return getValueFromProperty(element, beforeMargin);
};

export const getAfterMargin = (direction: Direction, element: Element | null) => {
	const { afterMargin } = getPropByDirection(direction);
	return getValueFromProperty(element, afterMargin);
};
export const getBefore = (direction: Direction, elementPosition: ElementPosition) => {
	const { before } = getPropByDirection(direction);
	return elementPosition[before];
};
export const getScrollElementValue = (direction: Direction, element: ElementScroll) => {
	const { scrollElement } = getPropByDirection(direction);
	return [element[scrollElement], scrollElement] as const;
};
export const getScrollValue = (direction: Direction, elementScroll: WindowScroll) => {
	const { scroll } = getPropByDirection(direction);
	return elementScroll[scroll];
};
export const getInnerDistance = (
	direction: Direction,
	innerElement: {
		innerWidth: number;
		innerHeight: number;
	}
) => {
	const { inner } = getPropByDirection(direction);
	return innerElement[inner];
};

export const getPageValue = (direction: Direction, event: { pageX: number; pageY: number }) => {
	const { page } = getPropByDirection(direction);
	return event[page];
};

export const getOffsetValue = (
	direction: Direction,
	event: { offsetX: number; offsetY: number }
) => {
	const { offset } = getPropByDirection(direction);
	return event[offset];
};

export const getPropByDirection = (direction: Direction) => {
	const ifHorizontal = direction == HORIZONTAL;
	return {
		beforeMargin: ifHorizontal ? 'marginLeft' : 'marginTop',
		afterMargin: ifHorizontal ? 'marginRight' : 'marginBottom',
		borderBeforeWidth: ifHorizontal ? 'borderLeftWidth' : 'borderTopWidth',
		before: ifHorizontal ? 'left' : 'top',
		gap: ifHorizontal ? 'columnGap' : 'rowGap',
		distance: ifHorizontal ? 'width' : 'height',
		axis: ifHorizontal ? 'x' : 'y',
		offset: ifHorizontal ? 'offsetX' : 'offsetY',
		scroll: ifHorizontal ? 'scrollX' : 'scrollY',
		scrollElement: ifHorizontal ? 'scrollLeft' : 'scrollTop',
		page: ifHorizontal ? 'pageX' : 'pageY',
		inner: ifHorizontal ? 'innerWidth' : 'innerHeight',
		scrollDistance: ifHorizontal ? 'scrollWidth' : 'scrollHeight',
		clientDistance: ifHorizontal ? 'clientWidth' : 'clientHeight',
		paddingBefore: ifHorizontal ? 'paddingLeft' : 'paddingTop',
		getRect
	} as const;
};
export const getSiblings = (current: HTMLElement, parent: HTMLElement) => {
	return getSiblingsByParent(current, parent);
};
export const getGroupDroppables = (currentDroppable: HTMLElement, droppableGroup?: string) => {
	if (!droppableGroup) {
		return [currentDroppable];
	}
	return Array.from(document.querySelectorAll(`.droppable-group-${droppableGroup}`));
};
export const getParentDraggableChildren = (parent: HTMLElement) => {
	const siblings = [...parent.children].filter((child) => containClass(child, DRAGGABLE_CLASS));
	return siblings;
};
export const getSiblingsByParent = (current: HTMLElement, parent: HTMLElement) => {
	const siblings = [...parent.children]
		.filter((child) => containClass(child, DRAGGABLE_CLASS) && !child.isEqualNode(current))
		.toReversed();

	const positionOnDroppable = [...parent.children].findLastIndex((child) =>
		child.isEqualNode(current)
	);

	return [siblings, positionOnDroppable, parent] as const;
};

const getNearestParentWithTranslate = (element: Element) => {
	let parent = element.parentElement;

	while (parent) {
		const computedStyles = window.getComputedStyle(parent);
		if (computedStyles.translate !== 'none' || computedStyles.willChange === 'transform') {
			return parent;
		}
		parent = parent.parentElement;
	}

	return null; // No fixed parent found
};

export const getNearestParentPositionWithTranslate = (element: Element, direction: Direction) => {
	const fixedParent = getNearestParentWithTranslate(element);
	return fixedParent
		? getBefore(direction, getRect(fixedParent)) + getBorderBeforeWidthValue(direction, fixedParent)
		: 0;
};

export const isSameNode = (element1: Element | null | undefined, element2: Element | null) => {
	return element1?.isSameNode(element2);
};
export const hasTransform = (element: HTMLElement | null) => {
	return element && getComputedStyle(element).transform !== 'none';
};
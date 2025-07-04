import { Coordinate, Direction, HORIZONTAL, VERTICAL } from '..';
import { BeforeMargin, AfterMargin, BorderWidth, PaddingBefore, Before } from '../../../index';
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

const getIntersection = (element1: Element, element2: Element) => {
	const rect1 = getRect(element1);
	const rect2 = getRect(element2);

	const intersectionY = intersectionByDirection(element1, element2, VERTICAL);
	const intersectionX = intersectionByDirection(element1, element2, HORIZONTAL);
	return {
		rect1,
		rect2,
		intersectionX,
		intersectionY
	};
};
export const getSize = (sibling: Element, direction: Direction) => {
	const { getRect, size, start } = getPropByDirection(direction);
	const siblingRect = getRect(sibling);
	const siblingPosition = siblingRect[start];
	const siblingSize = siblingRect[size];
	return [siblingPosition, siblingSize, siblingRect] as const;
};
const intersectionByDirection = (element1: Element, element2: Element, direction: Direction) => {
	const [element1Position, element1Size] = getSize(element1, direction);
	const [element2Position, element2Size] = getSize(element2, direction);
	return intersection(
		{
			x1: element1Position,
			x2: element1Position + element1Size
		},
		{
			x1: element2Position,
			x2: element2Position + element2Size
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
export const getPropByDirection = (direction: Direction) => {
	const ifHorizontal = direction == HORIZONTAL;
	return {
		startMargin: ifHorizontal ? 'marginLeft' : 'marginTop',
		endMargin: ifHorizontal ? 'marginRight' : 'marginBottom',
		borderWidth: ifHorizontal ? 'borderLeftWidth' : 'borderTopWidth',
		start: ifHorizontal ? 'left' : 'top',
		end: ifHorizontal ? 'right' : 'bottom',
		gap: ifHorizontal ? 'columnGap' : 'rowGap',
		size: ifHorizontal ? 'width' : 'height',
		axis: ifHorizontal ? 'x' : 'y',
		offset: ifHorizontal ? 'offsetX' : 'offsetY',
		scroll: ifHorizontal ? 'scrollX' : 'scrollY',
		scrollElement: ifHorizontal ? 'scrollLeft' : 'scrollTop',
		page: ifHorizontal ? 'pageX' : 'pageY',
		inner: ifHorizontal ? 'innerWidth' : 'innerHeight',
		scrollSize: ifHorizontal ? 'scrollWidth' : 'scrollHeight',
		clientSize: ifHorizontal ? 'clientWidth' : 'clientHeight',
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
	const siblings = [...parent.children].filter((child): child is HTMLElement =>
		containClass(child, DRAGGABLE_CLASS)
	);
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

const getNearestFixedParent = (element: Element) => {
	let parent = element.parentElement;

	while (parent) {
		const position = window.getComputedStyle(parent).position;
		if (position === 'fixed') {
			return parent;
		}
		parent = parent.parentElement;
	}

	return null; // No fixed parent found
};
export const getPositionWithBorder = (element: Element, direction: Direction) => {
	const { borderWidth, start } = getPropByDirection(direction);
	return getRect(element)[start] + getValueFromProperty(element, borderWidth);
};
export const getAxis = (direction: Direction) => {
	const { axis } = getPropByDirection(direction);
	return axis;
};
export const getAxisValue = (translate: Coordinate, direction: Direction) => {
	const axis = getAxis(direction);
	return translate[axis];
};
export const getNearestFixedParentPosition = (element: Element, direction: Direction) => {
	const fixedParent = getNearestFixedParent(element);
	return fixedParent ? getPositionWithBorder(fixedParent, direction) : 0;
};
export const getDimensionsWithMargin = (element: HTMLElement) => {
	const rect = getRect(element);
	const styles = window.getComputedStyle(element);

	const marginTop = parseFloat(styles.marginTop);
	const marginRight = parseFloat(styles.marginRight);
	const marginBottom = parseFloat(styles.marginBottom);
	const marginLeft = parseFloat(styles.marginLeft);

	return {
		width: rect.width + marginLeft + marginRight,
		height: rect.height + marginTop + marginBottom
	};
};

/**
 * Determines if one element is positioned after another element
 * @param element1 - The first element to compare
 * @param element2 - The second element to compare
 * @param direction - The direction to check (horizontal or vertical)
 * @returns true if element1 is positioned after element2 in the specified direction
 *
 * @example
 * ```typescript
 * import { isElementAfter, HORIZONTAL, VERTICAL } from './utils/GetStyles';
 *
 * // Check if element1 is positioned to the right of element2
 * const isAfterHorizontally = isElementAfter(element1, element2, HORIZONTAL);
 *
 * // Check if element1 is positioned below element2
 * const isAfterVertically = isElementAfter(element1, element2, VERTICAL);
 * ```
 */
export const isElementAfter = (
	element1: Element,
	element2: Element,
	direction: Direction
): boolean => {
	const rect1 = getRect(element1);
	const rect2 = getRect(element2);
	const { start } = getPropByDirection(direction);
	return rect1[start] > rect2[start];
};

import { Direction, HORIZONTAL, VERTICAL } from '../..';
import { Translate, WindowScroll } from '../../../../index';
import {
	getAfterMargin,
	getAxisValue,
	getBeforeMargin,
	getBorderBeforeWidthValue,
	getDistanceValue,
	getPropByDirection,
	getRect,
	getScrollElementValue,
	getScrollValue,
	getValueFromProperty
} from '../../utils/GetStyles';
import { getBeforeStyles, getGapInfo } from '../../utils/ParseStyles';
const getContentPosition = (direction: Direction, droppable: HTMLElement) => {
	const { paddingBefore } = getPropByDirection(direction);

	const borderBeforeWidthDroppable = getBorderBeforeWidthValue(direction, droppable);
	const paddingBeforeDroppable = getValueFromProperty(droppable, paddingBefore);
	const axisValue = getAxisValue(direction, getRect(droppable));

	return borderBeforeWidthDroppable + paddingBeforeDroppable + axisValue;
};
const getGroupTranslate = (droppable: HTMLElement, draggable: HTMLElement) => {
	const [top, left] = getBeforeStyles(draggable);

	const verticalContentPosition = getContentPosition(VERTICAL, droppable);
	const horizontalContentPosition = getContentPosition(HORIZONTAL, droppable);

	return [horizontalContentPosition - left, verticalContentPosition - top];
};
export default function getTranslateBeforeDropping(
	direction: Direction,
	siblings: Element[],
	sourceIndex: number,
	targetIndex: number,
	scroll: WindowScroll,
	previousScroll: { scrollLeft: number; scrollTop: number },
	initialWindowScroll: WindowScroll,
	droppable: HTMLElement,
	draggable?: HTMLElement
) {
	let height = 0;
	let width = 0;
	const isGroupDropping = Boolean(sourceIndex < 0 && draggable);
	if (sourceIndex === targetIndex && !isGroupDropping) {
		return addScrollToTranslate(
			{ height, width },
			direction,
			scroll,
			initialWindowScroll,
			isGroupDropping
		);
	}

	const [sourceElement, targetElement, siblingsBetween, isDraggedFoward] = getElementsRange(
		siblings,
		sourceIndex,
		targetIndex,
		draggable
	);

	if (isGroupDropping) {
		const [x, y] = getGroupTranslate(droppable, draggable!);
		height += y;
		width += x;
	}

	const [gap, hasGaps] = getGapInfo(droppable, direction);

	const [afterMarginOutside, beforeMarginOutside, spaceBeforeDraggedElement] =
		getBeforeAfterMarginBaseOnDraggedDirection(
			sourceElement,
			targetElement?.previousElementSibling,
			isDraggedFoward,
			hasGaps,
			isGroupDropping,
			direction
		);
	const [beforeSpace, space, afterSpace] = spaceWithMargins(
		siblingsBetween,
		gap,
		hasGaps,
		direction
	);
	const spaceBetween = getSpaceBetween(
		space,
		beforeSpace,
		afterSpace,
		beforeMarginOutside,
		afterMarginOutside,
		gap
	);
	const [scrollElementValue] = getScrollElementValue(direction, droppable);
	const scrollChange = isGroupDropping
		? scrollElementValue
		: getScrollChange(droppable, previousScroll, direction);
	const spaceCalc = isDraggedFoward
		? spaceBetween - spaceBeforeDraggedElement
		: spaceBeforeDraggedElement - spaceBetween;

	const translate = spaceCalc - scrollChange;
	if (direction === VERTICAL) {
		height += translate;
	} else if (direction === HORIZONTAL) {
		width += translate;
	}
	return addScrollToTranslate(
		{ height, width },
		direction,
		scroll,
		initialWindowScroll,
		isGroupDropping
	);
}

const getScrollChange = (
	parentElement: HTMLElement,
	previousScroll: { scrollLeft: number; scrollTop: number },
	direction: Direction
) => {
	const [scrollParent] = getScrollElementValue(direction, parentElement);
	const [previousScrollValue] = getScrollElementValue(direction, previousScroll);
	return scrollParent - previousScrollValue;
};
const getSpaceBetween = (
	innerSpace: number,
	beforeMarginSpace: number,
	afterMarginSpace: number,
	beforeMarginOutside: number,
	afterMarginOutside: number,
	gap: number
) => {
	const beforeMarginCalc = Math.max(beforeMarginSpace, afterMarginOutside);
	const afterMarginCalc = Math.max(afterMarginSpace, beforeMarginOutside);
	return afterMarginCalc + innerSpace + beforeMarginCalc + gap;
};
const getElementsRange = (
	siblings: Element[],
	sourceIndex: number,
	targetIndex: number,
	draggable?: HTMLElement
) => {
	const isDraggedFoward = sourceIndex < targetIndex;

	const [firstIndex, secondIndex] = [sourceIndex, targetIndex].toSorted((a, b) => a - b);
	const sourceElement = siblings[sourceIndex] ?? draggable;
	const targetElement = siblings[targetIndex];

	let siblingsBetween = isDraggedFoward
		? siblings.slice(firstIndex + 1, secondIndex + 1)
		: siblings.slice(firstIndex, secondIndex);

	if (firstIndex < 0 && draggable) {
		siblingsBetween = siblings.slice(firstIndex + 1, secondIndex);
	}
	return [sourceElement, targetElement, siblingsBetween, isDraggedFoward] as const;
};
const spaceWithMargins = (
	siblings: Element[],
	gap: number,
	hasGaps: boolean,
	direction: Direction
) => {
	if (siblings.length == 0) {
		return [0, 0, 0] as const;
	}
	const beforeSpace = getAfterMargin(direction, siblings[0]);
	let afterSpace = 0;
	let space = -beforeSpace;
	for (const [index, sibling] of siblings.entries()) {
		const [siblingSpace] = getDistanceValue(direction, getRect(sibling));
		const siblingBeforeMargin = getBeforeMargin(direction, sibling);
		if (hasGaps) {
			afterSpace += siblingBeforeMargin;
		}
		if (hasGaps && index > 0) {
			afterSpace += gap;
		} else {
			afterSpace = Math.max(afterSpace, siblingBeforeMargin);
		}
		space += afterSpace + siblingSpace;
		afterSpace = getAfterMargin(direction, sibling);
	}
	return [beforeSpace, space, afterSpace] as const;
};
const addScrollToTranslate = (
	translate: Translate,
	direction: Direction,
	initialScroll: WindowScroll,
	initialWindowScroll: WindowScroll,
	isGroupDropping: Boolean
) => {
	const actualWindowScroll = getScrollValue(direction, window);
	const initialScrollProp = getScrollValue(direction, initialScroll);
	const scrollChange = isGroupDropping
		? 0
		: initialScrollProp - 2 * actualWindowScroll + getScrollValue(direction, initialWindowScroll);
	const [, distance] = getDistanceValue(direction, translate);
	translate[distance] += scrollChange;
	return translate;
};
const getBeforeAfterMarginBaseOnDraggedDirection = (
	draggedElement: Element,
	previousElement: Element | null,
	isDraggedFoward: boolean,
	hasGaps: boolean,
	isGroupDropping: boolean,
	direction: Direction
) => {
	const previousElementByDirection = isDraggedFoward
		? draggedElement.previousElementSibling
		: previousElement;
	return getBeforeAfterMargin(
		previousElementByDirection,
		draggedElement,
		hasGaps,
		isGroupDropping,
		direction
	);
};
const getBeforeAfterMargin = (
	previousElement: HTMLElement | Element | null,
	nextElement: HTMLElement | Element | null,
	hasGaps: boolean,
	isGroupDropping: boolean,
	direction: Direction
) => {
	if (hasGaps) {
		return [0, 0, 0] as const;
	}
	const afterMarginValue = getAfterMargin(direction, isGroupDropping ? null : previousElement);
	const beforeMarginValue = getBeforeMargin(direction, nextElement);

	let spaceBeforeDraggedElement = Math.max(afterMarginValue, beforeMarginValue);
	return [afterMarginValue, beforeMarginValue, spaceBeforeDraggedElement] as const;
};

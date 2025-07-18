import { Direction, HORIZONTAL, VERTICAL } from '../..';
import {
	AfterMargin,
	BeforeMargin,
	Distance,
	ScrollElement,
	Translate,
	WindowScroll
} from '../../../../index';
import {
	getAxisValue,
	getBorderBeforeWidthValue,
	getPropByDirection,
	getRect,
	getValueFromProperty
} from '../../utils/GetStyles';
import { gapAndDisplayInformation, getBeforeStyles } from '../../utils/ParseStyles';
const getContentPosition = (direction: Direction, droppable: HTMLElement) => {
	const { paddingBefore, getRect } = getPropByDirection(direction);

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

	const {
		scrollElement,
		beforeMargin: beforeMarginProp,
		afterMargin: afterMarginProp,
		distance: spaceProp,
		gap: gapStyle
	} = getPropByDirection(direction);
	const [gap, hasGaps] = gapAndDisplayInformation(droppable, gapStyle);

	const [afterMarginOutside, beforeMarginOutside, spaceBeforeDraggedElement] =
		getBeforeAfterMarginBaseOnDraggedDirection(
			beforeMarginProp,
			afterMarginProp,
			sourceElement,
			targetElement?.previousElementSibling,
			isDraggedFoward,
			hasGaps,
			isGroupDropping
		);
	const [beforeSpace, space, afterSpace] = spaceWithMargins(
		beforeMarginProp,
		afterMarginProp,
		spaceProp,
		siblingsBetween,
		gap,
		hasGaps
	);
	const spaceBetween = getSpaceBetween(
		space,
		beforeSpace,
		afterSpace,
		beforeMarginOutside,
		afterMarginOutside,
		gap
	);
	const scrollChange = isGroupDropping
		? droppable[scrollElement]
		: getScrollChange(scrollElement, droppable, previousScroll);
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
	scrollElement: ScrollElement,
	parentElement: HTMLElement,
	previousScroll: { scrollLeft: number; scrollTop: number }
) => {
	const scrollParent = parentElement[scrollElement];
	const previousScrollValue = previousScroll[scrollElement];
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
	beforeMargin: BeforeMargin,
	afterMargin: AfterMargin,
	distance: Distance,
	siblings: Element[],
	gap: number,
	hasGaps: boolean
) => {
	if (siblings.length == 0) {
		return [0, 0, 0] as const;
	}
	const beforeSpace = getValueFromProperty(siblings[0], beforeMargin);
	let afterSpace = 0;
	let space = -beforeSpace;
	for (const [index, sibling] of siblings.entries()) {
		const siblingSpace = getRect(sibling)[distance];
		const siblingBeforeMargin = getValueFromProperty(sibling, beforeMargin);
		if (hasGaps) {
			afterSpace += siblingBeforeMargin;
		}
		if (hasGaps && index > 0) {
			afterSpace += gap;
		} else {
			afterSpace = Math.max(afterSpace, siblingBeforeMargin);
		}
		space += afterSpace + siblingSpace;
		afterSpace = getValueFromProperty(sibling, afterMargin);
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
	const { scroll, distance } = getPropByDirection(direction);
	const actualWindowScroll = window[scroll];
	const initialScrollProp = initialScroll[scroll];
	const scrollChange = isGroupDropping
		? 0
		: initialScrollProp - 2 * actualWindowScroll + initialWindowScroll[scroll];
	translate[distance] += scrollChange;
	return translate;
};
const getBeforeAfterMarginBaseOnDraggedDirection = (
	beforeMarginProp: BeforeMargin,
	afterMarginProp: AfterMargin,
	draggedElement: Element,
	previousElement: Element | null,
	isDraggedFoward: boolean,
	hasGaps: boolean,
	isGroupDropping: boolean
) => {
	const previousElementByDirection = isDraggedFoward
		? draggedElement.previousElementSibling
		: previousElement;
	return getBeforeAfterMargin(
		beforeMarginProp,
		afterMarginProp,
		previousElementByDirection,
		draggedElement,
		hasGaps,
		isGroupDropping
	);
};
const getBeforeAfterMargin = (
	beforeMarginProp: BeforeMargin,
	afterMarginProp: AfterMargin,
	previousElement: HTMLElement | Element | null,
	nextElement: HTMLElement | Element | null,
	hasGaps: boolean,
	isGroupDropping: boolean
) => {
	if (hasGaps) {
		return [0, 0, 0] as const;
	}
	const afterMargin = getValueFromProperty(
		isGroupDropping ? null : previousElement,
		afterMarginProp
	);
	const beforeMargin = getValueFromProperty(nextElement, beforeMarginProp);

	let spaceBeforeDraggedElement = Math.max(afterMargin, beforeMargin);
	return [afterMargin, beforeMargin, spaceBeforeDraggedElement] as const;
};

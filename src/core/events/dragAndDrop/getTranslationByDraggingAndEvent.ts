import { Direction, HORIZONTAL } from '../..';
import { DragAndDropEvent, DRAG_EVENT } from '../../utils';
import { AfterMargin } from '../../../../index';
import {
	draggableIsOutside,
	getPropByDirection,
	getValueFromProperty
} from '../../utils/GetStyles';
import { gapAndDisplayInformation } from '../../utils/ParseStyles';

export default function getTranslationByDraggingAndEvent(
	current: HTMLElement,
	event: DragAndDropEvent,
	direction: Direction,
	droppable: HTMLElement,
	previousElement = current.previousElementSibling,
	nextElement = current.nextElementSibling
) {
	let { height, width } = getTranslationByDragging(
		direction,
		current,
		previousElement,
		nextElement
	);
	const intersection = draggableIsOutside(current, droppable);
	if (intersection && event == DRAG_EVENT) {
		height = 0;
		width = 0;
	}
	return { height, width };
}

const getTranslationByDragging = (
	direction: Direction,
	current: HTMLElement,
	previous: Element | null,
	nextElement: Element | null
) => {
	const {
		endMargin: afterMargin,
		startMargin: beforeMargin,
		size: distance,
		gap: gapStyle,
		getRect
	} = getPropByDirection(direction);

	const after = getValueFromProperty(current, afterMargin);
	const before = getValueFromProperty(current, beforeMargin);
	const nextBefore = getValueFromProperty(nextElement, beforeMargin);

	const [gap, hasGaps] = gapAndDisplayInformation(current.parentElement, gapStyle);

	const space = getRect(current)[distance];
	if (hasGaps) {
		return getTranslation(space, before, after, gap, 0, direction);
	}
	const [afterSpace, beforeScace, rest] = getTranslationByDraggingWithoutGaps(
		previous,
		nextBefore,
		after,
		before,
		afterMargin
	);
	return getTranslation(space, beforeScace, afterSpace, 0, rest, direction);
};
const getTranslationByDraggingWithoutGaps = (
	previousElement: Element | null,
	nextBeforeMargin: number,
	currentAfterMargin: number,
	currentBeforeMargin: number,
	afterMargin: AfterMargin
) => {
	const afterSpace = Math.max(nextBeforeMargin, currentAfterMargin);
	let beforeScace = currentBeforeMargin;
	let rest = nextBeforeMargin;

	if (previousElement) {
		const previousAfterMargin = getValueFromProperty(previousElement, afterMargin);
		beforeScace = Math.max(previousAfterMargin, currentBeforeMargin);
		rest = Math.max(rest, previousAfterMargin);
	}
	return [afterSpace, beforeScace, rest] as const;
};
const getTranslation = (
	size: number,
	before: number,
	after: number,
	gap: number,
	rest: number,
	direction: Direction
) => {
	return getDistancesByDirection(direction, size + before + after + gap - rest);
};
const getDistancesByDirection = (direction: Direction, value: number) => {
	if (direction == HORIZONTAL) {
		return { width: value, height: 0 };
	} else {
		return { width: 0, height: value };
	}
};

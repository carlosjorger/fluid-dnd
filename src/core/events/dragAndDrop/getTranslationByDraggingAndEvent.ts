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
	const value = getTranslationValueByDraggingEvent(
		current,
		event,
		direction,
		droppable,
		previousElement,
		nextElement
	);
	return getDistancesByDirection(direction, value);
}
export function getTranslationByDraggingEventOverAGrid(
	current: HTMLElement,
	event: DragAndDropEvent,
	droppable: HTMLElement,
	previousElement = current.previousElementSibling,
	nextElement = current.nextElementSibling
) {
	const height = getTranslationValueByDraggingEvent(
		current,
		event,
		'vertical',
		droppable,
		previousElement,
		nextElement
	);
	const width = getTranslationValueByDraggingEvent(
		current,
		event,
		'horizontal',
		droppable,
		previousElement,
		nextElement
	);
	return { height, width };
}
function getTranslationValueByDraggingEvent(
	current: HTMLElement,
	event: DragAndDropEvent,
	direction: Direction,
	droppable: HTMLElement,
	previousElement = current.previousElementSibling,
	nextElement = current.nextElementSibling
) {
	let value = getTranslationValueByDragging(direction, current, previousElement, nextElement);
	const intersection = draggableIsOutside(current, droppable);
	if (intersection && event == DRAG_EVENT) {
		value = 0;
	}
	return value;
}

const getTranslationValueByDragging = (
	direction: Direction,
	current: HTMLElement,
	previous: Element | null,
	nextElement: Element | null
) => {
	const {
		afterMargin,
		beforeMargin,
		distance,
		gap: gapStyle,
		getRect
	} = getPropByDirection(direction);

	const after = getValueFromProperty(current, afterMargin);
	const before = getValueFromProperty(current, beforeMargin);
	const nextBefore = getValueFromProperty(nextElement, beforeMargin);

	const [gap, hasGaps] = gapAndDisplayInformation(current.parentElement, gapStyle);

	const space = getRect(current)[distance];
	if (hasGaps) {
		return getTranslationValue(space, before, after, gap, 0);
	}
	const [afterSpace, beforeScace, rest] = getTranslationByDraggingWithoutGaps(
		previous,
		nextBefore,
		after,
		before,
		afterMargin
	);
	return getTranslationValue(space, beforeScace, afterSpace, 0, rest);
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
const getTranslationValue = (
	size: number,
	before: number,
	after: number,
	gap: number,
	rest: number
) => {
	return size + before + after + gap - rest;
};

const getDistancesByDirection = (direction: Direction, value: number) => {
	if (direction == HORIZONTAL) {
		return { width: value, height: 0 };
	} else {
		return { width: 0, height: value };
	}
};

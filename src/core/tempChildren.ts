import { DroppableConfig } from './config/configHandler';
import { ElementScroll, Translate } from '../../index';
import { Direction, HORIZONTAL, VERTICAL } from '.';
import { getPropByDirection } from './utils/GetStyles';
import { getGapPixels } from './utils/ParseStyles';
import { setSizeStyles, setTranistion } from './utils/SetStyles';
import { observeMutation } from './utils/observer';
import getTranslationByDragging from './events/dragAndDrop/getTranslationByDraggingAndEvent';
import { TEMP_CHILD_CLASS } from './utils';
import { addClass, getClassesSelector } from './utils/dom/classList';

const START_DRAG_EVENT = 'startDrag';
const timingFunction = 'cubic-bezier(0.2, 0, 0, 1)';
const DELAY_TIME = 50;
// TODO: recactor getPropByDirection
const getDistance = (droppable: HTMLElement, draggedElement: HTMLElement, direction: Direction) => {
	let distances = getTranslationByDragging(draggedElement, START_DRAG_EVENT, direction, droppable);
	const gap = getGapPixels(droppable, direction);
	const { size } = getPropByDirection(direction);
	distances[size] -= gap;
	const [large, largeDistance] = getlarge(direction, draggedElement);
	distances[largeDistance] = large;
	return distances;
};
const getlarge = (direction: Direction, draggedElement: HTMLElement) => {
	const largeDirection = direction == HORIZONTAL ? VERTICAL : HORIZONTAL;
	const { size, getRect } = getPropByDirection(largeDirection);
	return [getRect(draggedElement)[size], size] as const;
};
const setSizes = (element: HTMLElement, height: number, width: number) => {
	setSizeStyles(element, height, width);
	element.style.minWidth = `${width}px`;
};
const updateChildAfterCreated = (
	child: HTMLElement,
	droppable: HTMLElement,
	distances: Translate
) => {
	return (observer: MutationObserver) => {
		if (!droppable.contains(child)) {
			return;
		}
		setSizes(child, distances.height, distances.width);
		observer.disconnect();
	};
};
const scrollPercent = (
	direction: Direction,
	droppable: HTMLElement,
	droppableScroll: ElementScroll
) => {
	const { scrollSize, clientSize, scrollElement } = getPropByDirection(direction);
	return droppableScroll[scrollElement] / (droppable[scrollSize] - droppable[clientSize]);
};
const fixScrollInitialChange = <T>(
	droppableConfig: DroppableConfig<T>,
	ifStartDragging: boolean
) => {
	if (!ifStartDragging) {
		return;
	}
	const { droppable, config, scroll } = droppableConfig;
	const { direction } = config;

	const scrollCompleted = scrollPercent(config.direction, droppable, scroll) > 0.99;
	const { scrollSize, clientSize, scrollElement } = getPropByDirection(direction);
	if (scrollCompleted) {
		droppable[scrollElement] = droppable[scrollSize] - droppable[clientSize];
	}
};
const getTempChild = <T>(
	draggedElement: HTMLElement | undefined,
	ifStartDragging: boolean,
	droppableConfig?: DroppableConfig<T>,
	addingAnimationDuration?: number
) => {
	if (!droppableConfig) {
		return;
	}
	const { droppable, config } = droppableConfig;
	const { direction, animationDuration } = config;

	fixScrollInitialChange(droppableConfig, ifStartDragging);

	if (droppable.querySelector(`.${TEMP_CHILD_CLASS}`) || !draggedElement) {
		return;
	}

	var tempChildTag = draggedElement.tagName == 'LI' ? 'DIV' : draggedElement.tagName;
	var child = document.createElement(tempChildTag);
	addClass(child, TEMP_CHILD_CLASS);
	setSizes(child, 0, 0);
	const distances = getDistance(droppable, draggedElement, direction);
	setTranistion(
		child,
		addingAnimationDuration ?? animationDuration,
		timingFunction,
		'width, min-width, height'
	);
	return [child, distances, droppable] as const;
};
export const addTempChild = <T>(
	draggedElement: HTMLElement | undefined,
	parent: Element,
	ifStartDragging: boolean,
	droppableConfig?: DroppableConfig<T>,
	addingAnimationDuration?: number
) => {
	const result = getTempChild(
		draggedElement,
		ifStartDragging,
		droppableConfig,
		addingAnimationDuration
	);
	if (!result) {
		return;
	}
	const [child, distances, droppable] = result;
	if (parent.isSameNode(droppable)) {
		setSizes(child, distances.height, distances.width);
	}
	observeMutation(updateChildAfterCreated(child, droppable, distances), droppable, {
		childList: true,
		subtree: true
	});
	droppable.appendChild(child);
};
export const addTempChildOnInsert = <T>(
	draggedElement: HTMLElement | undefined,
	ifStartDragging: boolean,
	droppableConfig?: DroppableConfig<T>
) => {
	const result = getTempChild(draggedElement, ifStartDragging, droppableConfig);
	if (!result) {
		return;
	}
	const [child, distances, droppable] = result;
	droppable.appendChild(child);
	setSizeAfterAppendChild(child, distances);
};
const setSizeAfterAppendChild = (child: HTMLElement, size: Translate) => {
	return requestAnimationFrame(() => {
		setSizes(child, size.height, size.width);
		requestAnimationFrame(() => {
			setTranistion(child, 0, timingFunction, 'width, min-width, height');
		});
	});
};
export const removeTempChildrens = (
	droppable: HTMLElement,
	parent: HTMLElement,
	droppableGroupClass: string | null,
	animationDuration: number,
	draggedElementIsOutside: boolean = true
) => {
	if (!droppableGroupClass) {
		return;
	}
	var children = document.querySelectorAll(
		`${getClassesSelector(droppableGroupClass)} > .${TEMP_CHILD_CLASS}`
	);

	children.forEach((tempChild) => {
		const childParent = tempChild.parentElement;
		if (
			childParent?.isSameNode(parent) ||
			(!draggedElementIsOutside && childParent?.isSameNode(droppable))
		) {
			return;
		}
		const tempChildElement = tempChild as HTMLElement;
		setSizes(tempChildElement, 0, 0);
		setTimeout(() => {
			tempChild.parentNode?.removeChild(tempChild);
		}, animationDuration + DELAY_TIME);
	});
};

export const removeTempChild = (
	parent: HTMLElement,
	animationDuration: number,
	isAnimated: boolean = false
) => {
	var lastChildren = parent.querySelectorAll(`.${TEMP_CHILD_CLASS}`);
	lastChildren.forEach((lastChild) => {
		const tempChildElement = lastChild as HTMLElement;
		if (isAnimated) {
			setSizes(tempChildElement, 0, 0);
			setTimeout(() => {
				if (parent.contains(tempChildElement)) {
					parent.removeChild(tempChildElement);
				}
			}, animationDuration + DELAY_TIME);
		} else {
			parent.removeChild(lastChild);
		}
	});
};

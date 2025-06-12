import {
	draggableIsOutside,
	getPropByDirection,
	getScrollElement,
	getSiblings,
	getWindowScroll
} from '../../utils/GetStyles';
import { Translate, WindowScroll } from '../../../../index';
import { moveTranslate, setTranistion } from '../../utils/SetStyles';
import { CoreConfig, Direction } from '../..';
import getTranslationByDragging from './getTranslationByDraggingAndEvent';
import getTranslateBeforeDropping from './getTranslateBeforeDropping';
import {
	DRAG_EVENT,
	draggableTargetTimingFunction,
	START_DRAG_EVENT,
	START_DROP_EVENT,
	TEMP_CHILD_CLASS
} from '../../utils';
import { DroppableConfig } from '../../config/configHandler';
import { IsHTMLElement } from '../../utils/typesCheckers';
import { removeTempChild } from '../../tempChildren';
import { DRAGGABLE_CLASS, DRAGGING_SORTABLE_CLASS, DROPPING_CLASS } from '../../utils/classes';
import { addClass, containClass, getClassesSelector, removeClass } from '../../utils/dom/classList';
import HandlerPublisher from '../../HandlerPublisher';
import { useChangeDraggableStyles } from '../changeDraggableStyles';
const DELAY_TIME_TO_SWAP = 50;

type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DropEvent = 'drop' | typeof START_DROP_EVENT;

export default function useDragAndDropEvents<T>(
	currentConfig: CoreConfig<T>,
	index: number,
	parent: HTMLElement,
	droppableGroupClass: string | null,
	handlerPublisher: HandlerPublisher,
	endDraggingAction: () => void
) {
	let actualIndex = index;
	let initialWindowScroll = {
		scrollX: 0,
		scrollY: 0
	};
	const { direction, onRemoveAtEvent, animationDuration, draggingClass } = currentConfig;

	const [removeElementDraggingStyles, toggleDraggingClass, dragEventOverElement] =
		useChangeDraggableStyles(currentConfig, handlerPublisher, endDraggingAction);

	const getPositionsArray = (droppable: HTMLElement, direction: Direction) => {
		const siblings = [...droppable.children].filter((child) =>
			child.classList.contains(DRAGGABLE_CLASS)
		);
		const { before, getRect } = getPropByDirection(direction);
		return siblings.map((sibling) => getRect(sibling)[before]);
	};
	const emitDraggingEvent = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T> | undefined
	) => {
		if (!droppableConfig) {
			return;
		}
		emitDraggingEventToSiblings(draggedElement, event, droppableConfig);
	};
	const emitDroppingEvent = (
		draggedElement: HTMLElement,
		event: DropEvent,
		droppableConfig: DroppableConfig<T> | undefined,
		initialWindowScroll: WindowScroll,
		positionOnSourceDroppable?: number
	) => {
		if (!droppableConfig) {
			return;
		}
		const { droppable, config } = droppableConfig;
		const tranlation = getTranslationByDragging(draggedElement, event, config.direction, droppable);
		emitDroppingEventToSiblings(
			draggedElement,
			event,
			tranlation,
			initialWindowScroll,
			droppableConfig,
			positionOnSourceDroppable
		);
	};
	let positions = [] as number[];
	// #region Drag events
	let draggingFoward = true;
	const getPosition = (
		droppableConfig: DroppableConfig<T>,
		index: number,
		direction: Direction
	) => {
		const { scroll: scrollProp, scrollElement } = getPropByDirection(direction);
		const actualWindowScroll = getWindowScroll();
		const windowScrollChange = initialWindowScroll[scrollProp] - actualWindowScroll[scrollProp];
		const { scroll, droppable } = droppableConfig;
		const scrollChange = scroll[scrollElement] - droppable[scrollElement];
		return positions[index] + windowScrollChange + scrollChange;
	};
	const emitDraggingEventToSiblings = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T>
	) => {
		const { config, droppable } = droppableConfig;
		const [siblings] = getSiblings(draggedElement, droppable);

		const draggableSortable = siblings.find((sibling) =>
			sibling.classList.contains(DRAGGING_SORTABLE_CLASS)
		);
		if (!draggableSortable) {
			return;
		}
		if (event == 'startDrag') {
			positions = getPositionsArray(droppable, direction);
			initialWindowScroll = getWindowScroll();
		}
		for (const [siblingIndex, sibling] of siblings.toReversed().entries()) {
			if (!containClass(sibling, DRAGGABLE_CLASS)) {
				continue;
			}
			const currentPosition = getIndex(siblingIndex, sibling);
			const [canChange, foward] = canChangeDraggable(
				droppableConfig,
				config.direction,
				draggedElement,
				sibling,
				currentPosition
			);
			if (
				canChange &&
				!sibling.isSameNode(draggableSortable) &&
				(actualIndex != currentPosition || draggingFoward != foward)
			) {
				draggingFoward = foward;
				actualIndex = currentPosition;
				translateDraggableSortable(draggableSortable, sibling, actualIndex);
				transleteSibling(sibling, siblingIndex, draggableSortable, !draggingFoward);
			} else if (
				(siblingIndex < actualIndex && siblingIndex < index) ||
				(siblingIndex > actualIndex && siblingIndex > index)
			) {
				dragEventOverElement(sibling, {
					width: 0,
					height: 0
				});
			} else if (siblingIndex < actualIndex && index < siblingIndex) {
				transleteSibling(sibling, siblingIndex, draggableSortable, true);
			} else if (siblingIndex > actualIndex && index > siblingIndex) {
				transleteSibling(sibling, siblingIndex, draggableSortable, false);
			}
		}
	};
	const getIndex = (targetIndex: number, sibling: Element) => {
		if (!IsHTMLElement(sibling)) {
			return targetIndex;
		}
		const tranlateProp = direction == 'horizontal' ? '--translate-x' : '--translate-y';
		const currentTranslate = parseFloat(sibling.style.getPropertyValue(tranlateProp) || '0');
		if (currentTranslate > 0) {
			return targetIndex + 1;
		} else if (currentTranslate < 0) {
			return targetIndex - 1;
		}
		return targetIndex;
	};
	const getDelta = (targetIndex: number, draggingDirection: number) => {
		const targetPosition = positions[targetIndex];
		const existingPosition = Boolean(positions[targetIndex - draggingDirection]);
		return existingPosition ? positions[targetIndex - draggingDirection] - targetPosition : 0;
	};
	const getDeltaDraggableSortable = (
		targetElement: Element,
		targetIndex: number,
		draggingDirection: number
	) => {
		let targetPosition = positions[targetIndex];
		const { distance, getRect } = getPropByDirection(direction);
		const targetBoundingClientRect = getRect(targetElement);
		const targetSize = targetBoundingClientRect[distance];
		if (draggingDirection > 0) {
			targetPosition += targetSize;
			draggingDirection -= 1;
		} else {
			targetPosition -= targetSize;
			draggingDirection += 1;
		}
		const existingPosition = Boolean(positions[targetIndex - draggingDirection]);
		return existingPosition ? positions[targetIndex - draggingDirection] - targetPosition : 0;
	};
	const translateDraggableSortable = (
		draggableSortable: Element,
		targetElement: Element,
		targetIndex: number
	) => {
		const draggingDirection = actualIndex - index;
		const deltaTargetPosition = getDeltaDraggableSortable(
			targetElement,
			targetIndex,
			draggingDirection
		);
		if (direction == 'horizontal') {
			settranslate(draggableSortable, -deltaTargetPosition, 0);
		} else {
			settranslate(draggableSortable, 0, -deltaTargetPosition);
		}
	};
	const getDeltaTargetPosition = (
		targetIndex: number,
		targetElement: Element,
		draggingDirection: number
	) => {
		const deltaTargetPosition = getDelta(targetIndex, draggingDirection);
		if (IsHTMLElement(targetElement) && deltaTargetPosition != 0) {
			const tranlateProp = direction == 'horizontal' ? '--translate-x' : '--translate-y';
			const currentTranslate = parseFloat(
				targetElement.style.getPropertyValue(tranlateProp) || '0'
			);
			if (currentTranslate != 0 && Math.sign(currentTranslate) != Math.sign(deltaTargetPosition)) {
				return 0;
			}
		}
		return deltaTargetPosition;
	};
	const transleteSibling = (
		targetElement: Element,
		targetIndex: number,
		draggableSortable: Element,
		foward: boolean
	) => {
		const draggingDirection = foward ? 1 : -1;
		const deltaTargetPosition = getDeltaTargetPosition(
			targetIndex,
			targetElement,
			draggingDirection
		);

		if (direction == 'horizontal') {
			settranslate(targetElement, deltaTargetPosition, 0);
		} else {
			settranslate(targetElement, 0, deltaTargetPosition);
		}
	};

	function settranslate(element: Element, x: number, y: number) {
		if (!IsHTMLElement(element)) {
			return;
		}

		element.style.setProperty('--translate-x', x + 'px');
		element.style.setProperty('--translate-y', y + 'px');

		element.style.transform = `
		  translate(var(--translate-x, 0), var(--translate-y, 0))
		  /* Other transforms can be added here */
		`;
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
	}
	const canChangeDraggable = (
		droppableConfig: DroppableConfig<T>,
		direction: Direction,
		sourceElement: Element,
		targetElement: Element,
		targetIndex: number
	) => {
		const { before, distance, getRect } = getPropByDirection(direction);
		const currentBoundingClientRect = getRect(sourceElement);
		const targetBoundingClientRect = getRect(targetElement);

		const currentPosition = currentBoundingClientRect[before];
		const currentSize = currentBoundingClientRect[distance];
		const currentEndPosition = currentPosition + currentSize;
		const targetPosition = getPosition(droppableConfig, targetIndex, direction);
		const targetSize = targetBoundingClientRect[distance];
		const targetMiddle = targetSize / 2;
		const targetEndPosition = targetPosition + targetSize;

		const instersectionAtTheBeggining = Math.abs(targetEndPosition - currentPosition);
		const instersectionAtTheEnd = Math.abs(targetPosition - currentEndPosition);

		const isIntersectedAtTheBeggining =
			instersectionAtTheBeggining > targetMiddle &&
			instersectionAtTheBeggining < targetSize &&
			currentPosition > targetPosition &&
			currentPosition < targetEndPosition;

		const isIntersectedAtTheEnd =
			instersectionAtTheEnd > targetMiddle &&
			instersectionAtTheEnd < targetSize &&
			currentEndPosition > targetPosition &&
			currentEndPosition < targetEndPosition;
		return [
			isIntersectedAtTheBeggining || isIntersectedAtTheEnd,
			isIntersectedAtTheBeggining
		] as const;
	};
	// #region Drop events
	const emitDroppingEventToSiblings = (
		draggedElement: HTMLElement,
		event: DropEvent,
		translation: Translate,
		initialWindowScroll: WindowScroll,
		droppableConfig: DroppableConfig<T>,
		positionOnSourceDroppable?: number
	) => {
		const { droppable, scroll, config } = droppableConfig;
		const [siblings, positionOnDroppable] = getSiblings(draggedElement, droppable);
		const allSiblings = siblings.toReversed();
		const realPositionOnDroppable =
			positionOnDroppable === -1 ? allSiblings.length : positionOnDroppable;

		allSiblings.splice(realPositionOnDroppable, 0, draggedElement);

		const [previousElement, nextElement, targetIndex] = getPreviousAndNextElement(
			draggedElement,
			positionOnDroppable,
			allSiblings,
			droppable
		);
		translation = getTranslationByDragging(
			draggedElement,
			event,
			config.direction,
			parent,
			previousElement,
			nextElement
		);
		const windowScroll = getWindowScroll();
		const draggableTranslation = getTranslateBeforeDropping(
			config.direction,
			allSiblings,
			positionOnDroppable,
			targetIndex,
			windowScroll,
			scroll,
			initialWindowScroll,
			droppable,
			draggedElement
		);
		if (siblings.length == 0) {
			startDropEventOverElement(undefined, translation, draggedElement, draggableTranslation);
		}

		for (const [index, sibling] of siblings.toReversed().entries()) {
			let newTranslation = translation;
			if (targetIndex - 1 >= index) {
				newTranslation = { height: 0, width: 0 };
			}
			if (event === START_DROP_EVENT && !containClass(sibling, TEMP_CHILD_CLASS)) {
				startDropEventOverElement(sibling, newTranslation, draggedElement, draggableTranslation);
			}
		}
		dropEventOverElement(targetIndex, draggedElement, config, droppable, positionOnSourceDroppable);
	};
	const getPreviousAndNextElement = (
		draggedElement: HTMLElement,
		elementPosition: number,
		allSiblings: Element[],
		droppable: HTMLElement
	) => {
		const isOutside = draggableIsOutside(draggedElement, droppable);

		const targetIndex = isOutside ? elementPosition : actualIndex;

		const getPreviousAndNextElementIndex = () => {
			if (elementPosition < targetIndex) {
				return [targetIndex, targetIndex + 1];
			} else if (elementPosition > targetIndex) {
				return [targetIndex - 1, targetIndex];
			} else {
				return [targetIndex - 1, targetIndex + 1];
			}
		};
		const [previousIndex, nextIndex] = getPreviousAndNextElementIndex();
		const previousElement = allSiblings[previousIndex] ?? null;
		const nextElement = allSiblings[nextIndex] ?? null;
		return [previousElement, nextElement, targetIndex] as const;
	};
	const startDropEventOverElement = (
		targetElement: Element | undefined,
		translation: Translate,
		element: HTMLElement,
		sourceElementTranlation: Translate
	) => {
		moveTranslate(targetElement, translation.height, translation.width);
		moveTranslate(element, sourceElementTranlation.height, sourceElementTranlation.width);
	};
	const dropEventOverElement = (
		targetIndex: number,
		element: HTMLElement,
		config: CoreConfig<T>,
		droppable: HTMLElement,
		positionOnSourceDroppable?: number
	) => {
		const { onInsertEvent, onDragEnd } = config;
		addClass(element, DROPPING_CLASS);
		removeStytes(element, parent, droppable, () => {
			removeClass(element, DROPPING_CLASS);
			if (positionOnSourceDroppable != undefined) {
				const value = onRemoveAtEvent(positionOnSourceDroppable, true);
				if (value != undefined) {
					onInsertEvent(targetIndex, value, true);
					onDragEnd({ value, index: targetIndex });
				}
				manageDraggingClass(element);
				clearExcessTranslateStyles();
			}
		});
	};
	const clearExcessTranslateStyles = () => {
		if (!droppableGroupClass) {
			return;
		}
		var children = document.querySelectorAll(
			`${getClassesSelector(droppableGroupClass)} > .${DRAGGABLE_CLASS}`
		);
		for (const element of children) {
			removeTranslateWhitoutTransition(element);
		}
	};
	const manageDraggingClass = (element: HTMLElement) => {
		setTimeout(() => {
			removeClass(element, draggingClass);
		}, DELAY_TIME_TO_SWAP);
	};
	const removeStytes = (
		element: HTMLElement,
		parent: HTMLElement,
		droppable: HTMLElement,
		func?: () => void
	) => {
		setTimeout(() => {
			func && func();
			removeTempChildOnDroppables(parent, droppable);
			reduceTempchildSize(droppable);
			removeElementDraggingStyles(element);
			removeTranslateFromSiblings(element, parent);
			removeTranslateFromSiblings(element, droppable);
		}, animationDuration);
	};
	const removeTempChildOnDroppables = (parent: HTMLElement, droppable: HTMLElement) => {
		if (parent.isSameNode(droppable)) {
			removeTempChild(parent, animationDuration);
		} else {
			removeTempChild(parent, animationDuration, true);
			removeTempChild(droppable, animationDuration);
		}
	};
	const reduceTempchildSize = (droppable: HTMLElement) => {
		if (parent.isSameNode(droppable)) {
			return;
		}
		var [lastChildren] = parent.querySelectorAll(`.${TEMP_CHILD_CLASS}`);
		if (!lastChildren) {
			return;
		}
		const { distance } = getPropByDirection(direction);
		if (IsHTMLElement(lastChildren)) {
			lastChildren.style[distance] = '0px';
		}
	};
	const removeTranslateFromSiblings = (element: HTMLElement, parent: HTMLElement) => {
		const [siblings] = getSiblings(element, parent);
		for (const sibling of [...siblings, element]) {
			removeTranslateWhitoutTransition(sibling);
		}
	};
	const removeTranslateWhitoutTransition = (element?: Element) => {
		if (IsHTMLElement(element)) {
			element.style.transition = '';
			element.style.transform = '';
		}
	};

	return [emitDraggingEvent, emitDroppingEvent, toggleDraggingClass] as const;
}

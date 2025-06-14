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
import { getGapPixels } from '../../utils/ParseStyles';
const DELAY_TIME_TO_SWAP = 50;

type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
type DropEvent = 'drop' | typeof START_DROP_EVENT;
const TRANSLATE_X = '--translate-x';
const TRANSLATE_Y = '--translate-y';
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

	const [removeElementDraggingStyles, toggleDraggingClass] = useChangeDraggableStyles(
		currentConfig,
		handlerPublisher,
		endDraggingAction
	);

	const getPositionsArray = (droppable: HTMLElement, direction: Direction) => {
		const siblings = [...droppable.children].filter((child) =>
			child.classList.contains(DRAGGABLE_CLASS)
		);
		const { before, after, getRect } = getPropByDirection(direction);
		const positions = siblings.map((sibling) => getRect(sibling)[before]);
		const lastSibling = siblings.at(-1);
		if (lastSibling) {
			const lastSiblingPosition = getRect(lastSibling)[after];
			const gap = getGapPixels(droppable, direction);
			positions.push(lastSiblingPosition + gap);
		}
		return positions;
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
	const getPosition = (
		droppableConfig: DroppableConfig<T>,
		element: HTMLElement,
		index: number,
		direction: Direction
	) => {
		const { scroll: scrollProp, scrollElement } = getPropByDirection(direction);
		const actualWindowScroll = getWindowScroll();
		const windowScrollChange = initialWindowScroll[scrollProp] - actualWindowScroll[scrollProp];
		const { scroll, droppable } = droppableConfig;
		const scrollChange = scroll[scrollElement] - droppable[scrollElement];
		const transalte = getTranslate(direction, element);
		return positions[index] + windowScrollChange + scrollChange + transalte;
	};
	const emitDraggingEventToSiblings = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T>
	) => {
		const { droppable } = droppableConfig;
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
			if (!containClass(sibling, DRAGGABLE_CLASS) || !IsHTMLElement(sibling)) {
				continue;
			}
			const currentPosition = getIndex(siblingIndex, sibling);
			const canChange = canChangeDraggable(droppableConfig, draggedElement, sibling, siblingIndex);
			if (canChange && !sibling.isSameNode(draggableSortable) && actualIndex != currentPosition) {
				actualIndex = currentPosition;
				translateDraggableSortable(draggableSortable, actualIndex);
				transleteSibling(sibling, siblingIndex);
			} else if (
				(siblingIndex < actualIndex && siblingIndex < index) ||
				(siblingIndex > actualIndex && siblingIndex > index)
			) {
				settranslate(sibling, 0, 0);
			} else if (siblingIndex < actualIndex && index < siblingIndex) {
				transleteSibling(sibling, siblingIndex);
			} else if (siblingIndex > actualIndex && index > siblingIndex) {
				transleteSibling(sibling, siblingIndex);
			}
		}
	};
	const getIndex = (targetIndex: number, sibling: Element) => {
		if (!IsHTMLElement(sibling)) {
			return targetIndex;
		}
		const currentTranslate = getTranslate(direction, sibling);
		if (currentTranslate > 0) {
			return targetIndex + 1;
		} else if (currentTranslate < 0) {
			return targetIndex - 1;
		}
		return targetIndex;
	};
	const getDelta = (targetIndex: number, deltaIndex: number) => {
		const targetPosition = positions[targetIndex] ?? 0;
		const existingPosition = Boolean(positions[targetIndex - deltaIndex]);
		return existingPosition ? positions[targetIndex - deltaIndex] - targetPosition : 0;
	};
	const getDeltaDraggableSortable = (targetIndex: number, draggingDirection: number) => {
		let nextIndex = targetIndex;
		if (draggingDirection > 0) {
			nextIndex += 1;
			draggingDirection -= 1;
		}
		const targetPosition = positions[nextIndex] ?? 0;
		const existingPosition = Boolean(positions[targetIndex - draggingDirection]);
		return existingPosition ? positions[targetIndex - draggingDirection] - targetPosition : 0;
	};
	const translateDraggableSortable = (draggableSortable: Element, targetIndex: number) => {
		const draggingDirection = actualIndex - index;
		const deltaTargetPosition = getDeltaDraggableSortable(targetIndex, draggingDirection);
		if (direction == 'horizontal') {
			settranslate(draggableSortable, -deltaTargetPosition, 0);
		} else {
			settranslate(draggableSortable, 0, -deltaTargetPosition);
		}
	};
	const getTranslate = (direction: Direction, element: HTMLElement) => {
		const tranlateProp = direction == 'horizontal' ? TRANSLATE_X : TRANSLATE_Y;
		const currentTranslate = parseFloat(element.style.getPropertyValue(tranlateProp) || '0');
		return currentTranslate;
	};
	const getDeltaTargetPosition = (
		targetIndex: number,
		targetElement: Element,
		draggingDirection: number,
		deltaIndex: number
	) => {
		const deltaTargetPosition = draggingDirection * Math.abs(getDelta(targetIndex, deltaIndex));
		if (IsHTMLElement(targetElement) && deltaTargetPosition != 0) {
			const currentTranslate = getTranslate(direction, targetElement);
			const diff = Math.sign(currentTranslate) * Math.sign(deltaTargetPosition);
			if (currentTranslate != 0 && diff == -1) {
				return 0;
			}
		}
		return deltaTargetPosition;
	};
	const transleteSibling = (targetElement: Element, targetIndex: number) => {
		const draggingDirection = index < targetIndex ? -1 : 1;

		const deltaDraggableSortable = getDeltaTargetPosition(
			index,
			targetElement,
			draggingDirection,
			-1
		);
		if (direction == 'horizontal') {
			settranslate(targetElement, deltaDraggableSortable, 0);
		} else {
			settranslate(targetElement, 0, deltaDraggableSortable);
		}
	};

	function settranslate(element: Element, x: number, y: number) {
		if (!IsHTMLElement(element)) {
			return;
		}

		element.style.setProperty(TRANSLATE_X, x + 'px');
		element.style.setProperty(TRANSLATE_Y, y + 'px');
		if (x == 0 && y == 0) {
			element.style.transform = '';
		} else {
			element.style.transform = `translate(var(${TRANSLATE_X}, 0), var(${TRANSLATE_Y}, 0))`;
		}
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
	}
	const canChangeDraggable = (
		droppableConfig: DroppableConfig<T>,
		sourceElement: Element,
		targetElement: HTMLElement,
		targetIndex: number
	) => {
		const { direction } = droppableConfig.config;
		const { before, distance, getRect } = getPropByDirection(direction);
		const currentBoundingClientRect = getRect(sourceElement);
		const targetBoundingClientRect = getRect(targetElement);

		const currentPosition = currentBoundingClientRect[before];
		const currentSize = currentBoundingClientRect[distance];
		const currentEndPosition = currentPosition + currentSize;
		const targetPosition = getPosition(droppableConfig, targetElement, targetIndex, direction);
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
		return isIntersectedAtTheBeggining || isIntersectedAtTheEnd;
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

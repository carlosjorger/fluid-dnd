import {
	draggableIsOutside,
	getPropByDirection,
	getSiblings,
	getTransform,
	getWindowScroll,
	isGridContainer
} from '../../utils/GetStyles';
import { Translate, WindowScroll } from '../../../../index';
import { moveTranslate } from '../../utils/SetStyles';
import { CoreConfig, Direction } from '../..';
import getTranslationByDragging, {
	getTranslationByDraggingEventOverAGrid
} from './getTranslationByDraggingAndEvent';
import getTranslateBeforeDropping from './getTranslateBeforeDropping';
import { DRAG_EVENT, START_DRAG_EVENT, START_DROP_EVENT, TEMP_CHILD_CLASS } from '../../utils';
import { DroppableConfig } from '../../config/configHandler';
import { IsHTMLElement } from '../../utils/typesCheckers';
import { removeTempChild } from '../../tempChildren';
import { DRAGGABLE_CLASS, DROPPING_CLASS } from '../../utils/classes';
import { addClass, containClass, getClassesSelector, removeClass } from '../../utils/dom/classList';
import HandlerPublisher from '../../HandlerPublisher';
import { useChangeDraggableStyles } from '../changeDraggableStyles';
import { isTempElement, observeMutation } from '../../utils/observer';
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
	const { direction, onRemoveAtEvent, animationDuration, draggingClass } = currentConfig;

	const [removeElementDraggingStyles, toggleDraggingClass, dragEventOverElement] =
		useChangeDraggableStyles(currentConfig, handlerPublisher, endDraggingAction);

	const emitDraggingEvent = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T> | undefined
	) => {
		if (!droppableConfig) {
			return;
		}
		const { droppable, config } = droppableConfig;
		if (isGridContainer(droppable)) {
			emitDraggingEventOverAGrid(draggedElement, event, droppableConfig);
		} else {
			const tranlation = getTranslationByDragging(
				draggedElement,
				event,
				config.direction,
				droppable
			);
			emitDraggingEventToSiblings(draggedElement, event, tranlation, droppableConfig);
		}
	};
	const emitDraggingEventOverAGrid = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T>
	) => {
		const { config, droppable } = droppableConfig;
		const [siblings] = getSiblings(draggedElement, droppable);
		const isOutside = draggableIsOutside(draggedElement, droppable);
		const tranlation = getTranslationByDraggingEventOverAGrid(draggedElement, event, droppable);
		console.log(tranlation);
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
	// #region Drag events
	const emitDraggingEventToSiblings = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		translation: Translate,
		droppableConfig: DroppableConfig<T>
	) => {
		const { config, droppable } = droppableConfig;
		const [siblings] = getSiblings(draggedElement, droppable);
		const isOutside = draggableIsOutside(draggedElement, droppable);
		if (siblings.length == 0) {
			updateActualIndexBaseOnTranslation(translation, 1, config.direction, siblings);
		}
		for (const [index, sibling] of siblings.entries()) {
			if (!containClass(sibling, DRAGGABLE_CLASS)) {
				continue;
			}
			const siblingTransition = canChangeDraggable(
				config.direction,
				draggedElement,
				sibling,
				translation
			);
			if (!isOutside && siblingTransition) {
				translation = siblingTransition;
			} else if (!isOutside) {
				continue;
			}
			const siblingRealIndex = siblings.length - index;
			updateActualIndexBaseOnTranslation(translation, siblingRealIndex, config.direction, siblings);
			if (event === START_DRAG_EVENT) {
				startDragEventOverElement(sibling, translation);
			} else if (event === DRAG_EVENT) {
				dragEventOverElement(sibling, translation);
			}
		}
	};
	const canChangeDraggable = (
		direction: Direction,
		sourceElement: Element,
		targetElement: Element,
		translation: Translate
	) => {
		const { before, distance, axis, getRect } = getPropByDirection(direction);
		const currentBoundingClientRect = getRect(sourceElement);
		const targetBoundingClientRect = getRect(targetElement);

		const currentPosition = currentBoundingClientRect[before];

		const targetPosition = targetBoundingClientRect[before];
		const targetSize = targetBoundingClientRect[distance];
		const targetMiddle = targetPosition + targetSize / 2;

		const targetTransform = getTransform(targetElement)[axis];
		const targetMiddleWithoutTransform = targetMiddle - targetTransform;

		if (currentPosition > targetMiddleWithoutTransform) {
			return { height: 0, width: 0 };
		}
		return translation;
	};
	const updateActualIndexBaseOnTranslation = (
		translation: Translate,
		siblingIndex: number,
		direction: Direction,
		siblings: Element[]
	) => {
		const itemsCount = siblings.filter((sibling) => containClass(sibling, DRAGGABLE_CLASS)).length;

		const { distance } = getPropByDirection(direction);
		if (translation[distance] == 0) {
			actualIndex = Math.max(actualIndex, siblingIndex);
		} else {
			actualIndex = Math.min(actualIndex, siblingIndex - 1);
		}
		actualIndex = Math.min(actualIndex, itemsCount);
	};
	const startDragEventOverElement = (element: Element, translation: Translate) => {
		const { width, height } = translation;
		moveTranslate(element, height, width);
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

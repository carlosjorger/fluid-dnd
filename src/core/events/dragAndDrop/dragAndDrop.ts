import {
	getParentDraggableChildren,
	getPropByDirection,
	getSiblings,
	getWindowScroll
} from '../../utils/GetStyles';
import { WindowScroll } from '../../../../index';
import {
	setTranistion,
	setTranslate,
	setTranslateByDirection,
	setTranslateWithTransition
} from '../../utils/SetStyles';
import { CoreConfig, Direction } from '../..';
import { DRAG_EVENT, draggableTargetTimingFunction, START_DRAG_EVENT } from '../../utils';
import { DroppableConfig } from '../../config/configHandler';
import { IsHTMLElement } from '../../utils/typesCheckers';
import { DRAGGABLE_CLASS, DRAGGING_SORTABLE_CLASS } from '../../utils/classes';
import { containClass } from '../../utils/dom/classList';
import HandlerPublisher from '../../HandlerPublisher';
import { useChangeDraggableStyles } from '../changeDraggableStyles';
import { getGapPixels } from '../../utils/ParseStyles';

type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;
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
	const { direction, onRemoveAtEvent, animationDuration } = currentConfig;

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
		droppableConfig: DroppableConfig<T> | undefined,
		initialWindowScroll: WindowScroll,
		positionOnSourceDroppable?: number
	) => {
		if (!droppableConfig) {
			return;
		}
		emitDroppingEventToSiblings(draggedElement, droppableConfig, initialWindowScroll);
	};
	let positions = [] as number[];
	// #region Drag events
	const getPosition = (
		droppableConfig: DroppableConfig<T>,
		element: HTMLElement,
		index: number,
		direction: Direction
	) => {
		const { droppable } = droppableConfig;
		const transalte = getTranslate(direction, element);
		const scrollChange = getScrollChange(droppableConfig, droppable, initialWindowScroll);
		return positions[index] + scrollChange + transalte;
	};
	const getDraggableSortable = (siblings: Element[]) => {
		return siblings.find((sibling) => sibling.classList.contains(DRAGGING_SORTABLE_CLASS));
	};
	const emitDraggingEventToSiblings = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T>
	) => {
		const { droppable } = droppableConfig;
		const [siblings] = getSiblings(draggedElement, droppable);

		const draggableSortable = getDraggableSortable(siblings);
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
				setTranslateWithTransition(currentConfig, sibling, 0, 0);
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
	const getDelta = (targetIndex: number, deltaIndex: number, nextIndex: number = targetIndex) => {
		const targetPosition = positions[nextIndex] ?? 0;
		const existingPosition = Boolean(positions[targetIndex - deltaIndex]);
		return existingPosition ? positions[targetIndex - deltaIndex] - targetPosition : 0;
	};
	const getDeltaDraggableSortable = (targetIndex: number, draggingDirection: number) => {
		let nextIndex = targetIndex;
		if (draggingDirection > 0) {
			nextIndex += 1;
			draggingDirection -= 1;
		}
		return getDelta(targetIndex, draggingDirection, nextIndex);
	};
	const translateDraggableSortable = (draggableSortable: Element, targetIndex: number) => {
		const draggingDirection = actualIndex - index;
		const deltaTargetPosition = getDeltaDraggableSortable(targetIndex, draggingDirection);
		setTranslateByDirection(currentConfig, draggableSortable, -deltaTargetPosition);
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
		setTranslateByDirection(currentConfig, targetElement, deltaDraggableSortable);
	};
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
	const getScrollChange = (
		droppableConfig: DroppableConfig<T>,
		droppable: HTMLElement,
		initialWindowScroll: WindowScroll
	) => {
		const { scroll } = droppableConfig;
		const { scrollElement, scroll: scrollProp } = getPropByDirection(direction);
		const actualWindowScroll = getWindowScroll();
		const scrollChange = scroll[scrollElement] - droppable[scrollElement];
		const windowScrollChange = initialWindowScroll[scrollProp] - actualWindowScroll[scrollProp];

		return scrollChange + windowScrollChange;
	};
	// #region Drop events
	const emitDroppingEventToSiblings = (
		draggedElement: HTMLElement,
		droppableConfig: DroppableConfig<T>,
		initialWindowScroll: WindowScroll
	) => {
		const { droppable, config } = droppableConfig;
		const siblings = getParentDraggableChildren(droppable);
		const draggableSortable = getDraggableSortable(siblings);
		if (!draggableSortable || !IsHTMLElement(draggableSortable)) {
			return;
		}
		let draggableSortableTranslateX = getTranslate('horizontal', draggableSortable);
		let draggableSortableTranslateY = getTranslate('vertical', draggableSortable);

		const scrollChange = getScrollChange(droppableConfig, droppable, initialWindowScroll);

		if (direction == 'horizontal') {
			draggableSortableTranslateX += scrollChange;
		} else {
			draggableSortableTranslateY += scrollChange;
		}

		setTranslateWithTransition(
			currentConfig,
			draggedElement,
			draggableSortableTranslateX,
			draggableSortableTranslateY
		);
		moveValue(config);
		removeDraggingStyles(siblings);
		removeDraggableSortableClass(draggableSortable);
		setTimeout(() => {
			removeFixedDraggableElement(draggedElement);
		}, animationDuration);
	};
	const moveValue = (config: CoreConfig<T>) => {
		const { onInsertEvent, onDragEnd } = config;
		const value = onRemoveAtEvent(index, true);
		if (value != undefined) {
			onInsertEvent(actualIndex, value, true);
			onDragEnd({ value, index: actualIndex });
		}
	};
	const removeDraggableSortableClass = (sibling: Element) => {
		sibling.classList.remove(DRAGGING_SORTABLE_CLASS);
	};
	const removeDraggingStyles = (siblings: Element[]) => {
		for (const sibling of siblings) {
			if (!IsHTMLElement(sibling)) {
				continue;
			}
			setTranslate(sibling, 0, 0);
			removeElementDraggingStyles(sibling);
		}
	};
	const removeFixedDraggableElement = (draggedElement: Element) => {
		document.body.removeChild(draggedElement);
	};
	return [emitDraggingEvent, emitDroppingEvent, toggleDraggingClass] as const;
}

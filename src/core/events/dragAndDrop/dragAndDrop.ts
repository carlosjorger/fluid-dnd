import {
	getDraggableSortable,
	getParentDraggableChildren,
	getPropByDirection,
	getSize,
	getWindowScroll
} from '../../utils/GetStyles';
import { WindowScroll } from '../../../../index';
import {
	getTranslate,
	setTranslate,
	setTranslateByDirection,
	setTranslateWithTransition
} from '../../utils/SetStyles';
import { CoreConfig, Direction, HORIZONTAL, VERTICAL } from '../..';
import { DRAG_EVENT, START_DRAG_EVENT } from '../../utils';
import { DroppableConfig } from '../../config/configHandler';
import { DRAGGABLE_CLASS, DRAGGING_SORTABLE_CLASS } from '../../utils/classes';
import HandlerPublisher from '../../HandlerPublisher';
import { useChangeDraggableStyles } from '../changeDraggableStyles';
import { getGapPixels } from '../../utils/ParseStyles';

type DraggingEvent = typeof DRAG_EVENT | typeof START_DRAG_EVENT;

export default function useDragAndDropEvents<T>(
	currentConfig: CoreConfig<T>,
	index: number,
	handlerPublisher: HandlerPublisher,
	emitInsert: (targetIndex: number, value: T, endInsertEvent: () => void) => void
) {
	let actualIndex = index;
	let initialWindowScroll = {
		scrollX: 0,
		scrollY: 0
	};
	let value: T | undefined;
	const { animationDuration } = currentConfig;

	const [removeElementDraggingStyles, toggleDraggingClass] = useChangeDraggableStyles(
		currentConfig,
		handlerPublisher
	);

	const getPositionsArray = (droppable: HTMLElement, direction: Direction) => {
		const siblings = [...droppable.children].filter((child) =>
			child.classList.contains(DRAGGABLE_CLASS)
		);
		const { end, getRect } = getPropByDirection(direction);

		const positions = siblings.map((sibling) => getSize(sibling, direction)[0]);
		const lastSibling = siblings.at(-1);
		if (lastSibling) {
			const lastSiblingPosition = getRect(lastSibling)[end];
			const gap = getGapPixels(droppable, direction);
			positions.push(lastSiblingPosition + gap);
		}
		return positions;
	};

	let positions = [] as number[];
	let currentDroppable = null as HTMLElement | null;
	// #region Drag events
	const changeCurrentDroppable = (
		droppable: HTMLElement,
		direction: Direction,
		event: DraggingEvent
	) => {
		if (currentDroppable && currentDroppable.isSameNode(droppable) && event != START_DRAG_EVENT) {
			return;
		}
		initNewDroppableConfig(droppable, direction);
		currentDroppable = droppable;
	};
	const initNewDroppableConfig = (droppable: HTMLElement | null, direction: Direction) => {
		if (droppable) {
			positions = getPositionsArray(droppable, direction);
			initialWindowScroll = getWindowScroll();
		}
	};
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
	const insertDraggableSortableToDroppable = (currentPosition: number, direction: Direction) => {
		insertDraggableSortable(currentPosition, () => {
			initNewDroppableConfig(currentDroppable, direction);
			actualIndex = currentPosition;
			index = currentPosition;
		});
	};
	const emitDraggingEvent = (
		draggedElement: HTMLElement,
		event: DraggingEvent,
		droppableConfig: DroppableConfig<T> | undefined
	) => {
		if (!droppableConfig) {
			return;
		}
		const { droppable, config } = droppableConfig;
		const { direction } = config;

		const siblings = getParentDraggableChildren(droppable);
		const draggableSortable = getDraggableSortable(droppable);

		if (event == START_DRAG_EVENT) {
			value = currentConfig.onGetValue(index);
		}
		changeCurrentDroppable(droppable, direction, event);
		if (!draggableSortable && siblings.length === 0) {
			insertDraggableSortableToDroppable(0, direction);
			return;
		}
		for (const [siblingIndex, sibling] of siblings.entries()) {
			const currentPosition = getIndex(siblingIndex, sibling, direction);
			const canChange = canChangeDraggable(droppableConfig, draggedElement, sibling, siblingIndex);
			// TODO: fix canChange that work first and last positon
			if (!draggableSortable && canChange) {
				insertDraggableSortableToDroppable(currentPosition, direction);
				return;
			}
			if (!draggableSortable) {
				continue;
			}
			if (canChange && !sibling.isSameNode(draggableSortable) && actualIndex != currentPosition) {
				actualIndex = currentPosition;
				translateDraggableSortable(draggableSortable, actualIndex, config);
				transleteSibling(sibling, siblingIndex, config);
			} else if (
				(siblingIndex < actualIndex && siblingIndex < index) ||
				(siblingIndex > actualIndex && siblingIndex > index)
			) {
				setTranslateWithTransition(droppableConfig.config, sibling, 0, 0);
			} else if (
				(siblingIndex < actualIndex && index < siblingIndex) ||
				(siblingIndex > actualIndex && index > siblingIndex)
			) {
				transleteSibling(sibling, siblingIndex, config);
			}
		}
	};
	const insertDraggableSortable = (targetIndex: number, endInsertEvent: () => void) => {
		value && emitInsert(targetIndex, value, endInsertEvent);
	};
	const getIndex = (targetIndex: number, sibling: HTMLElement, direction: Direction) => {
		const currentTranslate = getTranslate(direction, sibling);
		return targetIndex + Math.sign(currentTranslate);
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
	const translateDraggableSortable = (
		draggableSortable: HTMLElement,
		targetIndex: number,
		config: CoreConfig<T>
	) => {
		const draggingDirection = actualIndex - index;
		const deltaTargetPosition = getDeltaDraggableSortable(targetIndex, draggingDirection);
		setTranslateByDirection(config, draggableSortable, -deltaTargetPosition);
	};
	const getDeltaTargetPosition = (targetIndex: number, draggingDirection: number) => {
		const deltaTargetPosition = draggingDirection * Math.abs(getDelta(targetIndex, -1));
		return deltaTargetPosition;
	};
	const transleteSibling = (
		targetElement: HTMLElement,
		targetIndex: number,
		config: CoreConfig<T>
	) => {
		const draggingDirection = index < targetIndex ? -1 : 1;
		const deltaDraggableSortable = getDeltaTargetPosition(index, draggingDirection);
		setTranslateByDirection(config, targetElement, deltaDraggableSortable);
	};
	const canChangeDraggable = (
		droppableConfig: DroppableConfig<T>,
		sourceElement: Element,
		targetElement: HTMLElement,
		targetIndex: number
	) => {
		const { direction } = droppableConfig.config;

		const [currentPosition, currentSize] = getSize(sourceElement, direction);
		const currentEndPosition = currentPosition + currentSize;

		const [, targetSize] = getSize(targetElement, direction);
		const targetMiddle = targetSize / 2;
		const targetPosition = getPosition(droppableConfig, targetElement, targetIndex, direction);
		const targetEndPosition = targetPosition + targetSize;

		const isIntersected = (actualTargetPosition: number, actualCurrentPosition: number) => {
			const instersection = Math.abs(actualTargetPosition - actualCurrentPosition);
			return instersection > targetMiddle && instersection < targetSize;
		};
		const isIntersectedAtTheBeggining = isIntersected(targetEndPosition, currentPosition);
		const isIntersectedAtTheEnd = isIntersected(targetPosition, currentEndPosition);
		const intersected = isIntersectedAtTheBeggining || isIntersectedAtTheEnd;

		const currentPositionInsideTarget =
			currentPosition > targetPosition && currentPosition < targetEndPosition;
		const targetPositionInsideCurrent =
			targetPosition > currentPosition && targetPosition < currentEndPosition;

		return intersected && (targetPositionInsideCurrent || currentPositionInsideTarget);
	};
	const getScrollChange = (
		droppableConfig: DroppableConfig<T>,
		droppable: HTMLElement,
		initialWindowScroll: WindowScroll
	) => {
		const { scroll, config } = droppableConfig;
		const { scrollElement, scroll: scrollProp } = getPropByDirection(config.direction);
		const actualWindowScroll = getWindowScroll();
		const scrollChange = scroll[scrollElement] - droppable[scrollElement];
		const windowScrollChange = initialWindowScroll[scrollProp] - actualWindowScroll[scrollProp];

		return scrollChange + windowScrollChange;
	};

	// #region Drop events
	const getAbsolutePosition = (direction: Direction, element: HTMLElement) => {
		const transalte = getTranslate(direction, element);
		const [position] = getSize(element, direction);
		return position - transalte;
	};
	const getAbsolutePositions = (element: HTMLElement) => {
		const x = getAbsolutePosition(HORIZONTAL, element);
		const y = getAbsolutePosition(VERTICAL, element);
		return [x, y];
	};
	const getInitialPosition = (draggedElement: HTMLElement, draggableSortable: HTMLElement) => {
		const [draggedElementX, draggedElementY] = getAbsolutePositions(draggedElement);
		const [draggableSortableX, draggableSortableY] = getAbsolutePositions(draggableSortable);
		return [draggableSortableX - draggedElementX, draggableSortableY - draggedElementY] as const;
	};
	const emitDroppingEvent = (
		draggedElement: HTMLElement,
		droppableConfig: DroppableConfig<T> | undefined
	) => {
		if (!droppableConfig) {
			return;
		}
		const { droppable, config } = droppableConfig;
		const siblings = getParentDraggableChildren(droppable);
		const draggableSortable = getDraggableSortable(droppable);
		if (!draggableSortable) {
			return;
		}
		const [initialX, initialY] = getInitialPosition(draggedElement, draggableSortable);

		const draggableSortableTranslateX = getTranslate(HORIZONTAL, draggableSortable) + initialX;
		const draggableSortableTranslateY = getTranslate(VERTICAL, draggableSortable) + initialY;

		setTranslateWithTransition(
			droppableConfig.config,
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
		const { onInsertEvent, onRemoveAtEvent, onDragEnd } = config;
		const value = onRemoveAtEvent(index, true);
		if (value != undefined) {
			onInsertEvent(actualIndex, value, true);
			onDragEnd({ value, index: actualIndex });
		}
	};
	const removeDraggableSortableClass = (sibling: Element) => {
		sibling.classList.remove(DRAGGING_SORTABLE_CLASS);
	};
	const removeDraggingStyles = (siblings: HTMLElement[]) => {
		for (const sibling of siblings) {
			setTranslate(sibling, 0, 0);
			removeElementDraggingStyles(sibling);
		}
	};
	const removeFixedDraggableElement = (draggedElement: Element) => {
		document.body.removeChild(draggedElement);
	};
	return [emitDraggingEvent, emitDroppingEvent, toggleDraggingClass] as const;
}

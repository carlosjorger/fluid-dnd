import { getParentDraggableChildren } from '../utils/GetStyles';
import { CoreConfig } from '../index';
import getTranslationByDragging from '../events/dragAndDrop/getTranslationByDraggingAndEvent';
import { IsHTMLElement } from '../utils/typesCheckers';
import { addTempChildOnInsert, removeTempChild } from '../tempChildren';
import { DISABLE_TRANSITION, DRAGGABLE_CLASS, DRAGGING_SORTABLE_CLASS } from '../utils/classes';
import { addClass, containClass, removeClass } from '../utils/dom/classList';
import HandlerPublisher from '../HandlerPublisher';
import { isTempElement, observeMutation } from '../utils/observer';
import { useChangeDraggableStyles } from './changeDraggableStyles';
import { DroppableConfig } from '../config/configHandler';
import { removeTranslate } from '../utils/SetStyles';

export default function useInsertEvents<T>(handlerPublisher: HandlerPublisher) {
	// #region Insert
	const emitInsertEvent = (
		targetIndex: number,
		draggedElement: HTMLElement,
		value: T,
		droppableConfig?: DroppableConfig<T>,
		addDraggingSortableClass: boolean = false,
		endInsertEvent: () => void = () => {}
	) => {
		if (!droppableConfig) {
			return;
		}
		const currentConfig = droppableConfig.config;
		const { delayBeforeInsert } = currentConfig;
		const [, , dragEventOverElement] = useChangeDraggableStyles(currentConfig, handlerPublisher);
		const { droppable } = droppableConfig;
		const translation = getTranslationByDragging(
			draggedElement,
			'insert',
			currentConfig.direction,
			droppable
		);
		const { onInsertEvent } = currentConfig;
		const siblings = getParentDraggableChildren(droppable);
		for (const [index, sibling] of siblings.entries()) {
			if (!containClass(sibling, DRAGGABLE_CLASS)) {
				continue;
			}
			if (index >= targetIndex) {
				dragEventOverElement(sibling, translation);
			}
		}
		addTempChildOnInsert(draggedElement, true, droppableConfig);
		setTimeout(() => {
			onInsertEvent(targetIndex, value);
			onFinishInsertElement(
				targetIndex,
				droppable,
				currentConfig,
				addDraggingSortableClass,
				endInsertEvent
			);
			removeTranslateFromSiblings(droppable);
			removeTempChild(droppable, 0, true);
		}, delayBeforeInsert);
	};

	const removeTranslateFromSiblings = (parent: HTMLElement) => {
		const siblings = getParentDraggableChildren(parent);
		for (const sibling of siblings) {
			removeTranslateWhitoutTransition(sibling);
		}
	};
	const removeTranslateWhitoutTransition = (element?: Element) => {
		if (IsHTMLElement(element)) {
			removeTranslate(element);
		}
	};

	return [emitInsertEvent] as const;
}
const childrenMutationFilter = (mutation: MutationRecord) => {
	const addedNodes = mutation.addedNodes
		.values()
		.filter((element) => !isTempElement(element))
		.toArray();
	return addedNodes.length > 0;
};
const onFinishInsertElement = <T>(
	targetIndex: number,
	droppable: HTMLElement,
	config: CoreConfig<T>,
	addDraggingSortableClass: boolean = false,
	endInsertEvent: () => void = () => {}
) => {
	const { insertingFromClass, animationDuration } = config;
	const observer = observeMutation(
		() => {
			const siblings = getParentDraggableChildren(droppable);
			const newElement = siblings[targetIndex];
			addClass(newElement, insertingFromClass);
			addClass(newElement, DISABLE_TRANSITION);
			if (addDraggingSortableClass) {
				addClass(newElement, DRAGGING_SORTABLE_CLASS);
			}
			setTimeout(() => {
				removeClass(newElement, DISABLE_TRANSITION);
				removeClass(newElement, insertingFromClass);
				observer.disconnect();
				endInsertEvent();
			}, animationDuration);
		},
		droppable,
		{
			childList: true
		},
		childrenMutationFilter
	);
};
export const insertToListEmpty = <T>(
	config: CoreConfig<T>,
	droppable: HTMLElement | undefined | null,
	targetIndex: number,
	value: T
) => {
	if (!droppable) {
		return;
	}
	const { onInsertEvent, delayBeforeInsert } = config;
	setTimeout(() => {
		onInsertEvent(targetIndex, value);
		onFinishInsertElement(targetIndex, droppable, config);
	}, delayBeforeInsert);
};

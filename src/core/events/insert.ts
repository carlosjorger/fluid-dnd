import { getParentDraggableChildren, getSiblings } from '../utils/GetStyles';
import { CoreConfig } from '../index';
import getTranslationByDragging from '../events/dragAndDrop/getTranslationByDraggingAndEvent';
import { addTempChildOnInsert, removeTempChild } from '../tempChildren';
import { DISABLE_TRANSITION, DRAGGABLE_CLASS } from '../utils/classes';
import { addClass, containClass, removeClass } from '../utils/dom/classList';
import HandlerPublisher from '../HandlerPublisher';
import { isTempElement, observeMutation } from '../utils/observer';
import { useChangeDraggableStyles } from './changeDraggableStyles';
import { removeTranslateWhitoutTransition } from '../utils/SetStyles';
import { DroppableConfig } from '../config/configHandler';

export default function useInsertEvents<T>(
	currentConfig: CoreConfig<T>,
	parent: HTMLElement,
	handlerPublisher: HandlerPublisher,
	endDraggingAction: () => void
) {
	const { delayBeforeInsert } = currentConfig;
	const [removeElementDraggingStyles, _, dragEventOverElement] = useChangeDraggableStyles(
		currentConfig,
		handlerPublisher,
		endDraggingAction
	);
	// #region Insert
	const emitInsertEventToSiblings = (
		targetIndex: number,
		draggedElement: HTMLElement,
		droppable: HTMLElement,
		value: T,
		droppableConfigurator: DroppableConfig<T>
	) => {
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
		addTempChildOnInsert(draggedElement, false, droppableConfigurator);
		setTimeout(() => {
			onInsertEvent(targetIndex, value);
			onFinishInsertElement(targetIndex, droppable, currentConfig);
			removeElementDraggingStyles(draggedElement);
			removeTranslateFromSiblings(draggedElement, parent);
			removeTempChild(parent, 0, true);
		}, delayBeforeInsert);
	};

	const removeTranslateFromSiblings = (element: HTMLElement, parent: HTMLElement) => {
		const [siblings] = getSiblings(element, parent);
		for (const sibling of [...siblings, element]) {
			removeTranslateWhitoutTransition(sibling);
		}
	};

	return [emitInsertEventToSiblings] as const;
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
	config: CoreConfig<T>
) => {
	const { insertingFromClass, animationDuration } = config;
	const observer = observeMutation(
		() => {
			const siblings = getParentDraggableChildren(droppable);
			const newElement = siblings[targetIndex];
			addClass(newElement, insertingFromClass);
			addClass(newElement, DISABLE_TRANSITION);
			setTimeout(() => {
				removeClass(newElement, DISABLE_TRANSITION);
				removeClass(newElement, insertingFromClass);
				observer.disconnect();
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

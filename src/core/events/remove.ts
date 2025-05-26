import { getParentDraggableChildren, getSiblings } from '../utils/GetStyles';
import { Translate } from '../../../index';
import { moveTranslate } from '../utils/SetStyles';
import { CoreConfig } from '..';
import getTranslationByDragging from './dragAndDrop/getTranslationByDraggingAndEvent';
import { DroppableConfig } from '../droppableConfig/configHandler';
import { IsHTMLElement } from '../utils/typesCheckers';
import { removeTempChild } from '../tempChildren/tempChildren';
import { DISABLE_TRANSITION } from '../utils/classes';
import { addClass, removeClass } from '../utils/dom/classList';
import { isTempElement, observeMutation } from '../utils/observer';
import { useChangeDraggableStyles } from './changeDraggableStyles';
import HandlerPublisher from '@/core/HandlerPublisher';

export default function useRemoveEvents<T>(
	currentConfig: CoreConfig<T>,
	parent: HTMLElement,
	handlerPublisher: HandlerPublisher,
	endDraggingAction: () => void
) {
	const { animationDuration } = currentConfig;
	const [removeElementDraggingStyles] = useChangeDraggableStyles(
		currentConfig,
		handlerPublisher,
		endDraggingAction
	);
	const emitRemoveEventToSiblings = (
		targetIndex: number,
		draggedElement: HTMLElement,
		droppableConfig: DroppableConfig<T>,
		onFinishRemoveEvent: (element: HTMLElement) => void
	) => {
		if (!droppableConfig || !droppableConfig.droppable || !droppableConfig.config) {
			return;
		}
		const { droppable, config } = droppableConfig;
		let [siblings] = getSiblings(draggedElement, droppable);
		siblings = [draggedElement, ...siblings].toReversed();
		const translation = getTranslationByDragging(
			draggedElement,
			'remove',
			config.direction,
			droppable
		);
		for (const [index, sibling] of siblings.entries()) {
			if (index >= targetIndex) {
				startDragEventOverElement(sibling, translation);
				setTimeout(() => {
					onFinishRemoveEvent(sibling as HTMLElement);
				}, animationDuration);
			}
		}
	};
	const emitFinishRemoveEventToSiblings = (draggedElement: HTMLElement) => {
		removeTempChild(parent, animationDuration, true);
		setTimeout(() => {
			removeElementDraggingStyles(draggedElement);
			removeTranslateFromSiblings(draggedElement, parent);
		}, animationDuration);
	};

	const startDragEventOverElement = (element: Element, translation: Translate) => {
		const { width, height } = translation;
		moveTranslate(element, height, width);
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
	return [emitRemoveEventToSiblings, emitFinishRemoveEventToSiblings] as const;
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

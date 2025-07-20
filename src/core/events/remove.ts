import { getSiblings } from '../utils/GetStyles';
import { moveTranslate, removeTranslateWhitoutTransition, setTranistion } from '../utils/SetStyles';
import { CoreConfig, DraggingState } from '..';
import getTranslationByDragging from './dragAndDrop/getTranslationByDraggingAndEvent';
import { DroppableConfig } from '../config/configHandler';
import { addTempChild, removeTempChild } from '../tempChildren';
import { useChangeDraggableStyles } from './changeDraggableStyles';
import HandlerPublisher from '@/core/HandlerPublisher';
import { addClass, removeClass } from '../utils/dom/classList';
import { draggableTargetTimingFunction } from '../utils';

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
				moveTranslate(sibling, translation);
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

	const removeTranslateFromSiblings = (element: HTMLElement, parent: HTMLElement) => {
		const [siblings] = getSiblings(element, parent);
		for (const sibling of [...siblings, element]) {
			removeTranslateWhitoutTransition(sibling);
		}
	};
	const removeAt = (
		index: number,
		targetIndex: number,
		draggableElement: HTMLElement,
		draggingState: DraggingState,
		config: DroppableConfig<T>
	) => {
		const { removingClass, delayBeforeRemove } = currentConfig;

		if (targetIndex == index) {
			addClass(draggableElement, removingClass);
			setTimeout(() => {
				removeAfterRemovingClass(index, targetIndex, draggableElement, draggingState, config);
			}, delayBeforeRemove);
		}
	};
	const removeAfterRemovingClass = (
		index: number,
		targetIndex: number,
		draggableElement: HTMLElement,
		draggingState: DraggingState,
		config: DroppableConfig<T>
	) => {
		const { removingClass, onRemoveAtEvent } = currentConfig;
		removeClass(draggableElement, removingClass);
		addTempChild(draggableElement, parent, draggingState == DraggingState.START_DRAGGING, config);
		emitRemoveEventToSiblings(targetIndex, draggableElement, config, (sibling) => {
			removeDraggingStyles(sibling);
			emitFinishRemoveEventToSiblings(draggableElement);
		});
		onRemoveAtEvent(index, true);
	};
	const removeDraggingStyles = (element: Element) => {
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
		moveTranslate(element);
	};
	return [removeAt] as const;
}

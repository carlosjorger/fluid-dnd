import { Translate } from 'index';
import { CoreConfig } from '..';
import HandlerPublisher from '../HandlerPublisher';
import { DRAGGING_CLASS, DRAGGING_HANDLER_CLASS, GRABBING_CLASS } from '../utils/classes';
import { toggleClass } from '../utils/dom/classList';
import {
	moveTranslate,
	removeTranslateWhitoutTransition,
	setCustomFixedSize,
	setTranistion
} from '../utils/SetStyles';
import { draggableTargetTimingFunction } from '../utils';
export const useChangeDraggableStyles = <T>(
	currentConfig: CoreConfig<T>,
	handlerPublisher: HandlerPublisher,
	endDraggingAction: () => void
) => {
	const { handlerSelector, animationDuration } = currentConfig;

	const removeElementDraggingStyles = (element: HTMLElement) => {
		endDraggingAction();
		toggleDraggingClass(element, false);
		removeTranslateWhitoutTransition(element);
		element.style.top = '';
		element.style.left = '';
		setCustomFixedSize(element, {
			fixedHeight: '',
			fixedWidth: ''
		});
	};
	const toggleDraggingClass = (element: Element, force: boolean) => {
		toggleClass(element, DRAGGING_CLASS, force);
		toogleHandlerDraggingClass(force, element);
		handlerPublisher.toggleGrabClass(!force);
	};
	const toogleHandlerDraggingClass = (force: boolean, element: Element) => {
		const handlerElement = element.querySelector(handlerSelector);
		toggleClass(document.body, GRABBING_CLASS, force);
		if (handlerElement) {
			toggleClass(handlerElement, DRAGGING_HANDLER_CLASS, force);
		} else {
			toggleClass(element, DRAGGING_HANDLER_CLASS, force);
		}
	};
	const dragEventOverElement = (element: Element, translation?: Translate) => {
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
		moveTranslate(element, translation);
	};
	return [removeElementDraggingStyles, toggleDraggingClass, dragEventOverElement] as const;
};

import { Translate } from 'index';
import { CoreConfig } from '..';
import HandlerPublisher from '../HandlerPublisher';
import {
	DRAGGABLE_CLASS,
	DRAGGING_CLASS,
	DRAGGING_HANDLER_CLASS,
	GRABBING_CLASS
} from '../utils/classes';
import { toggleClass } from '../utils/dom/classList';
import {
	removeTranslate,
	setCustomFixedSize,
	setTranistion,
	setTranslate
} from '../utils/SetStyles';
import { draggableTargetTimingFunction } from '../utils';
export const useChangeDraggableStyles = <T>(
	currentConfig: CoreConfig<T>,
	handlerPublisher: HandlerPublisher
) => {
	const { handlerSelector, animationDuration } = currentConfig;

	const removeElementDraggingStyles = (element: HTMLElement) => {
		removeTranslate(element);
		element.style.top = '';
		element.style.left = '';
		setCustomFixedSize(element, {
			fixedHeight: '',
			fixedWidth: ''
		});
	};
	const toggleDraggingClass = (element: Element, force: boolean) => {
		if (force) {
			toggleClass(element, DRAGGING_CLASS, force);
		}
		toogleHandlerDraggingClass(force, element);
		handlerPublisher.toggleGrabClass(!force);
	};
	const toogleHandlerDraggingClass = (force: boolean, element: Element) => {
		const draggableElement = element.classList.contains(DRAGGABLE_CLASS)
			? element
			: element.querySelector(`.${DRAGGABLE_CLASS}`);

		const handlerElement = draggableElement?.querySelector(handlerSelector);
		toggleClass(document.body, GRABBING_CLASS, force);
		if (handlerElement) {
			toggleClass(handlerElement, DRAGGING_HANDLER_CLASS, force);
		} else if (draggableElement) {
			toggleClass(draggableElement, DRAGGING_HANDLER_CLASS, force);
		}
	};
	const dragEventOverElement = (element: Element, translation: Translate) => {
		const { width, height } = translation;
		setTranslate(element, width, height);
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
	};
	return [removeElementDraggingStyles, toggleDraggingClass, dragEventOverElement] as const;
};

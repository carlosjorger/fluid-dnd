import {
	assignDraggingEvent,
	convetEventToDragMouseTouchEvent,
	moveTranslate,
	setCustomFixedSize,
	setEventWithInterval,
	setTranistion
} from './utils/SetStyles';
import { usePositioning } from './positioning/usePositioning';
import { Coordinate, DragMouseTouchEvent, MoveEvent, OnLeaveEvent } from '../../index';
import { CoreConfig, DragStartEventData } from '.';
import {
	DRAG_EVENT,
	draggableTargetTimingFunction,
	START_DRAG_EVENT,
	START_DROP_EVENT
} from './utils';
import ConfigHandler, { DroppableConfig } from './config/configHandler';
import { IsHTMLElement, isTouchEvent } from './utils/typesCheckers';
import { addTempChild, removeTempChildrens } from './tempChildren';
import { DroppableConfigurator } from './config/droppableConfigurator';
import {
	addClass,
	containClass,
	getClassesList,
	getClassesSelector,
	toggleClass
} from './utils/dom/classList';
import { DRAGGABLE_CLASS, DRAGGING_CLASS, DROPPABLE_CLASS, HANDLER_CLASS } from './utils/classes';
import HandlerPublisher from './HandlerPublisher';
import useDragAndDropEvents from './events/dragAndDrop/dragAndDrop';
import { getRect, isSameNode } from './utils/GetStyles';

const ON_MOUSEDOWN = 'onmousedown';
const enum DraggingState {
	NOT_DRAGGING,
	START_DRAGGING,
	DRAGING,
	END_DRAGGING
}
export default function useDraggable<T>(
	draggableElement: HTMLElement,
	index: number,
	config: CoreConfig<T>,
	parent: HTMLElement,
	handlerPublisher: HandlerPublisher
) {
	const {
		handlerSelector,
		isDraggable,
		droppableGroup,
		animationDuration,
		draggingClass,
		droppableClass,
		onDragStart,
		delayBeforeTouchMoveEvent,
		coordinateTransform
	} = config;
	const droppableGroupClass = getClassesList(droppableGroup)
		.map((classGroup) => `droppable-group-${classGroup}`)
		.join(' ');

	let draggingState: DraggingState = DraggingState.NOT_DRAGGING;
	let windowScroll = {
		scrollX: 0,
		scrollY: 0
	};
	let pagePosition = { pageX: 0, pageY: 0 };
	let delayTimeout: NodeJS.Timeout | undefined;
	let initialTouch: Coordinate | undefined;
	const [setTransform, updateTransformState] = usePositioning(
		draggableElement,
		coordinateTransform
	);
	const endDraggingState = () => {
		draggingState = DraggingState.NOT_DRAGGING;
	};
	const [emitDraggingEvent, emitDroppingEvent, toggleDraggingClass] = useDragAndDropEvents<T>(
		config,
		index,
		parent,
		droppableGroupClass,
		handlerPublisher,
		endDraggingState
	);

	const setDraggable = () => {
		addClass(draggableElement, DRAGGABLE_CLASS);
	};
	const addHandlerClass = (handlerElement: Element | HTMLElement) => {
		addClass(handlerElement, HANDLER_CLASS);
		handlerPublisher.addSubscriber(handlerElement);
	};
	const setHandlerStyles = () => {
		if (isDraggable(draggableElement)) {
			const handlerElement = draggableElement.querySelector(handlerSelector);
			if (handlerElement) {
				addHandlerClass(handlerElement);
			} else {
				addHandlerClass(draggableElement);
			}
		}
	};

	const setCssStyles = () => {
		setHandlerStyles();
		setDraggable();
	};
	const getHandler = (element: HTMLElement | undefined) => {
		const handler = element?.querySelector(`.${HANDLER_CLASS}`);
		const handlerParent = handler?.parentElement;
		if (
			handler &&
			handlerParent &&
			containClass(handlerParent, DROPPABLE_CLASS) &&
			!isSameNode(parent, handlerParent)
		) {
			return null;
		}
		return handler;
	};
	const setSlotRefElementParams = (element: HTMLElement) => {
		const handlerElement = (getHandler(element) ?? element) as HTMLElement;
		if (handlerElement && isDraggable(element)) {
			assignDraggingEvent(handlerElement, ON_MOUSEDOWN, onmousedown('mousemove', 'mouseup'));
			assignDraggingEvent(
				handlerElement,
				'ontouchstart',
				onmousedown('touchmove', 'touchend'),
				(event) => {
					const touch = event.touches[0];
					initialTouch = {
						x: touch.clientX,
						y: touch.clientY
					};
				}
			);
			disableMousedownEventFromImages(handlerElement);
		}
		if (!isSameNode(element, handlerElement)) {
			assignDraggingEvent(element, ON_MOUSEDOWN, mousedownOnDraggablefunction);
		}
		addClass(parent, DROPPABLE_CLASS);
	};
	const disableMousedownEventFromImages = (handlerElement: Element) => {
		const images = handlerElement.querySelectorAll('img');
		Array.from(images).forEach((image) => {
			image.onmousedown = () => false;
		});
	};
	const setTransformDragEvent = () => {
		if (pagePosition.pageX == 0 && pagePosition.pageY == 0) {
			return;
		}
		if (!droppableConfigurator.current) {
			return;
		}
		const { droppable, config } = droppableConfigurator.current;
		setTransform(draggableElement, droppable, pagePosition, config.direction);
		emitDraggingEvent(draggableElement, DRAG_EVENT, droppable, config);
	};
	const removeTranslates = (droppable: Element) => {
		const drgagables = droppable.querySelectorAll(`.${DRAGGABLE_CLASS}`);
		for (const draggable of drgagables) {
			moveTranslate(draggable);
		}
	};
	const changeDroppable = (
		newdDroppableConfig: DroppableConfig<T> | undefined,
		oldDroppableConfig: DroppableConfig<T> | undefined
	) => {
		if (
			oldDroppableConfig &&
			draggingState == DraggingState.DRAGING &&
			!isSameNode(newdDroppableConfig?.droppable, oldDroppableConfig.droppable)
		) {
			emitDraggingEvent(
				draggableElement,
				DRAG_EVENT,
				oldDroppableConfig.droppable,
				oldDroppableConfig.config
			);
			removeTranslates(oldDroppableConfig.droppable);
		}
	};
	const droppableConfigurator = new DroppableConfigurator(
		draggableElement,
		droppableGroupClass,
		parent,
		setTransformDragEvent,
		changeDroppable,
		config.mapFrom
	);
	const toggleDroppableClass = (isOutside: boolean) => {
		if (!droppableConfigurator.current) {
			return;
		}
		const droppables = droppableGroupClass
			? Array.from(document.querySelectorAll(getClassesSelector(droppableGroupClass)))
			: [parent];
		for (const droppable of droppables) {
			droppable.classList.toggle(
				droppableClass,
				!isOutside && isSameNode(droppable, droppableConfigurator.current.droppable)
			);
		}
	};
	const onMove = (event: DragMouseTouchEvent, isTouchEvent: boolean = false) => {
		droppableConfigurator.updateConfig(event);
		const isOutside = droppableConfigurator.isOutside(event);
		toggleDroppableClass(isOutside);
		if (draggingState === DraggingState.START_DRAGGING && !isTouchEvent) {
			startDragging(event);
		} else if (draggingState === DraggingState.DRAGING) {
			updateTempChildren(isOutside);
			setTransformEvent(event);
		}
	};
	const updateTempChildren = (isOutside: boolean = true) => {
		if (!droppableConfigurator.current) {
			return;
		}
		const { droppable } = droppableConfigurator.current;
		removeTempChildrens(droppable, parent, droppableGroupClass, animationDuration, isOutside);
		if (isOutside) {
			return;
		}
		addTempChild(
			draggableElement,
			parent,
			draggingState == DraggingState.START_DRAGGING,
			droppableConfigurator.current
		);
	};
	const cursorWasNotMoved = (event: MouseEvent | TouchEvent) => {
		if (isTouchEvent(event) && initialTouch && draggingState == DraggingState.START_DRAGGING) {
			const touch = event.touches[0];
			const movedX = Math.abs(touch.clientX - initialTouch.x);
			const movedY = Math.abs(touch.clientY - initialTouch.y);
			if (Math.abs(movedX) > 5 && Math.abs(movedY) > 5) {
				clearTimeout(delayTimeout);
				return false;
			}
		}
		return true;
	};
	const handleMove = (event: MouseEvent | TouchEvent) => {
		clearTimeout(delayTimeout);
		const eventToDragMouse = convetEventToDragMouseTouchEvent(event);
		if (isTouchEvent(event) && event.cancelable && draggingState == DraggingState.DRAGING) {
			event.preventDefault();
		}
		if ((isTouchEvent(event) && !event.cancelable) || !cursorWasNotMoved(event)) {
			disableDragging('touchmove', event);
			return;
		}
		onMove(eventToDragMouse, isTouchEvent(event));
	};
	const addTouchDeviceDelay = (event: MoveEvent, callback: () => void) => {
		if (event == 'touchmove') {
			delayTimeout = setTimeout(() => {
				callback();
			}, delayBeforeTouchMoveEvent);
		} else {
			callback();
		}
	};
	const cursorIsOnChildDraggable = (event: DragMouseTouchEvent, element: HTMLElement) => {
		const { clientX, clientY } = event;
		const elementBelow = document.elementFromPoint(clientX, clientY);
		const draggableAncestor = elementBelow?.closest(`.${DRAGGABLE_CLASS}`);
		return draggableAncestor && isSameNode(element, draggableAncestor);
	};
	const getDragStartEventData = (element: Element): DragStartEventData<T> | undefined => {
		const value = config.onGetValue(index);
		return { index, element, value };
	};
	const startTouchMoveEvent = (event: DragMouseTouchEvent) => {
		droppableConfigurator.updateConfig(event);
		toggleDroppableClass(droppableConfigurator.isOutside(event));
		startDragging(event);
	};
	const onmousedown = (moveEvent: MoveEvent, onLeaveEvent: OnLeaveEvent) => {
		return (event: DragMouseTouchEvent) => {
			if (!cursorIsOnChildDraggable(event, draggableElement)) {
				return;
			}
			ConfigHandler.updateScrolls(parent, droppableGroupClass);
			const { scrollX, scrollY } = window;
			windowScroll = { scrollX, scrollY };
			if (draggingState === DraggingState.NOT_DRAGGING) {
				draggingState = DraggingState.START_DRAGGING;
				const data = getDragStartEventData(draggableElement);
				data && onDragStart(data);
				addTouchDeviceDelay(moveEvent, () => {
					if (moveEvent == 'touchmove') {
						startTouchMoveEvent(event);
					}
				});
				document.addEventListener(moveEvent, handleMove, {
					passive: false
				});
				makeScrollEventOnDroppable(parent);
				document.addEventListener(onLeaveEvent, onLeave(moveEvent), {
					once: true
				});
			}
		};
	};
	const mousedownOnDraggablefunction = (event: DragMouseTouchEvent) => {
		return droppableConfigurator.updateConfig(event);
	};
	const onLeave = (moveEvent: MoveEvent) => {
		return (event: MouseEvent | TouchEvent) => {
			disableDragging(moveEvent, event);
		};
	};
	const disableDragging = (moveEvent: MoveEvent, event: MouseEvent | TouchEvent) => {
		toggleDroppableClass(true);
		const convertedEvent = convetEventToDragMouseTouchEvent(event);
		onDropDraggingEvent(droppableConfigurator.isOutside(convertedEvent));
		clearTimeout(delayTimeout);
		document.removeEventListener(moveEvent, handleMove);
		droppableConfigurator.updateConfig(convertedEvent);
		const currentConfig = droppableConfigurator.getCurrentConfig(convertedEvent);
		if (currentConfig) {
			const { droppable } = currentConfig;
			removeOnScrollEvents(droppable);
		}
		parent.onscroll = null;
		endDraggingState();
	};
	const removeOnScrollEvents = (droppable: HTMLElement) => {
		droppable.onscroll = null;
		if (!droppableGroupClass) {
			return;
		}
		const droppables = Array.from(
			document.querySelectorAll(getClassesSelector(droppableGroupClass))
		);
		for (const droppable of droppables) {
			if (IsHTMLElement(droppable)) {
				droppable.onscroll = null;
			}
		}
	};
	const startDragging = (event: DragMouseTouchEvent) => {
		droppableConfigurator.current &&
			addTempChild(
				draggableElement,
				parent,
				draggingState == DraggingState.START_DRAGGING,
				droppableConfigurator.current
			);
		updateDraggingStateBeforeDragging();
		droppableConfigurator.current &&
			emitDraggingEvent(
				draggableElement,
				START_DRAG_EVENT,
				droppableConfigurator.current.droppable,
				droppableConfigurator.current.config
			);
		setDraggingStyles(draggableElement);
		updateTransformState(event, draggableElement);
	};
	const updateDraggingStateBeforeDragging = () => {
		draggingState = DraggingState.DRAGING;
	};
	const setTransformEvent = (event: DragMouseTouchEvent) => {
		const { pageX, pageY } = event;
		pagePosition = { pageX, pageY };
		setTransformDragEvent();
	};
	const makeScrollEventOnDroppable = (droppable: Element) => {
		return setEventWithInterval(droppable, 'onscroll', onScrollEvent);
	};
	const onScrollEvent = () => {
		return setTransformDragEvent();
	};
	const onDropDraggingEvent = (isOutsideAllDroppables: boolean) => {
		if (draggingState !== DraggingState.DRAGING && draggingState !== DraggingState.START_DRAGGING) {
			endDraggingState();
			return;
		}
		draggingState = DraggingState.END_DRAGGING;
		removeDraggingStyles(draggableElement);
		if (draggableElement.classList.contains(DRAGGING_CLASS)) {
			emitDroppingEvent(
				draggableElement,
				START_DROP_EVENT,
				isOutsideAllDroppables ? droppableConfigurator.initial : droppableConfigurator.current,
				windowScroll,
				index
			);
		}
	};
	const removeDraggingStyles = (element: Element) => {
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
		moveTranslate(element);
	};
	const setDraggingStyles = (element: HTMLElement) => {
		const { height, width } = getRect(element);
		setCustomFixedSize(element, {
			fixedHeight: `${height}px`,
			fixedWidth: `${width}px`
		});
		toggleDraggingClass(element, true);
		toggleClass(element, draggingClass, true);
		element.style.transition = '';
	};

	const removeAtFromElement = (targetIndex: number) => {
		import('./events/remove').then((module) => {
			const [removeAt] = module.default<T>(config, parent, handlerPublisher, endDraggingState);
			droppableConfigurator.initial &&
				removeAt(index, targetIndex, draggableElement, droppableConfigurator.initial);
		});
	};

	const insertAtFromElement = (targetIndex: number, value: T) => {
		if (
			targetIndex === index ||
			(targetIndex === config.onGetLegth() && index === targetIndex - 1)
		) {
			import('./events/insert').then((module) => {
				const [emitInsertEventToSiblings] = module.default(
					config,
					parent,
					handlerPublisher,
					endDraggingState
				);
				droppableConfigurator.initial &&
					emitInsertEventToSiblings(
						targetIndex,
						draggableElement,
						parent,
						value,
						droppableConfigurator.initial
					);
			});
		}
	};
	setCssStyles();
	setSlotRefElementParams(draggableElement);
	return [removeAtFromElement, insertAtFromElement] as const;
}

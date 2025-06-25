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
import useRemoveEvents from './events/remove';
import { DRAG_EVENT, draggableTargetTimingFunction, START_DRAG_EVENT } from './utils';
import ConfigHandler, { DroppableConfig } from './config/configHandler';
import { IsHTMLElement, isTouchEvent } from './utils/typesCheckers';
import { addTempChild, removeTempChildrens } from './tempChildren';
import { DroppableConfigurator } from './config/droppableConfigurator';
import {
	addClass,
	containClass,
	getClassesList,
	getClassesSelector,
	removeClass,
	toggleClass
} from './utils/dom/classList';
import {
	DRAGGABLE_CLASS,
	DRAGGING_CLASS,
	DROPPABLE_CLASS,
	HANDLER_CLASS,
	DRAGGING_SORTABLE_CLASS
} from './utils/classes';
import HandlerPublisher from './HandlerPublisher';
import useDragAndDropEvents from './events/dragAndDrop/dragAndDrop';
import useInsertEvents from './events/insert';

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
		delayBeforeRemove,
		draggingClass,
		removingClass,
		onRemoveAtEvent,
		droppableClass,
		onDragStart,
		delayBeforeTouchMoveEvent,
		coordinateTransform
	} = config;
	let fixedDraggableElement: HTMLElement | undefined;
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
	const [emitRemoveEventToSiblings, emitFinishRemoveEventToSiblings] = useRemoveEvents<T>(
		config,
		parent,
		handlerPublisher
	);
	const [emitDraggingEvent, emitDroppingEvent, toggleDraggingClass] = useDragAndDropEvents<T>(
		config,
		index,
		parent,
		droppableGroupClass,
		handlerPublisher,
		endDraggingState
	);
	const [emitInsertEventToSiblings] = useInsertEvents(config, parent, handlerPublisher);
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
			!handlerParent.isSameNode(parent)
		) {
			return null;
		}
		return handler;
	};
	const setSlotRefElementParams = (element: HTMLElement) => {
		const handlerElement = (getHandler(element) ?? element) as HTMLElement;
		if (handlerElement && isDraggable(element)) {
			assignDraggingEvent(handlerElement, 'onmousedown', onmousedown('mousemove', 'mouseup'));
			assignDraggingEvent(
				handlerElement,
				'ontouchstart',
				onmousedown('touchmove', 'touchend'),
				(event) => {
					initialTouch = {
						x: event.touches[0].clientX,
						y: event.touches[0].clientY
					};
				}
			);
			disableMousedownEventFromImages(handlerElement);
		}
		if (!element?.isSameNode(handlerElement)) {
			assignDraggingEvent(element, 'onmousedown', mousedownOnDraggablefunction);
		}
		addClass(parent, DROPPABLE_CLASS);
	};
	const disableMousedownEventFromImages = (handlerElement: Element) => {
		// Avoid dragging inner images
		const images = handlerElement.querySelectorAll('img');
		Array.from(images).forEach((image) => {
			image.onmousedown = () => false;
		});
	};
	const setTransformDragEvent = () => {
		if (pagePosition.pageX == 0 && pagePosition.pageY == 0) {
			return;
		}
		if (!droppableConfigurator.current || !fixedDraggableElement) {
			return;
		}
		const { droppable, config } = droppableConfigurator.current;
		setTransform(fixedDraggableElement, droppable, pagePosition, config.direction);
		emitDraggingEvent(fixedDraggableElement, DRAG_EVENT, droppableConfigurator.current);
	};
	const removeTranslates = (droppable: Element) => {
		const drgagables = droppable.querySelectorAll(`.${DRAGGABLE_CLASS}`);
		for (const draggable of drgagables) {
			moveTranslate(draggable, 0, 0);
		}
	};
	const changeDroppable = (
		newdDroppableConfig: DroppableConfig<T> | undefined,
		oldDroppableConfig: DroppableConfig<T> | undefined
	) => {
		if (
			oldDroppableConfig &&
			draggingState == DraggingState.DRAGING &&
			!newdDroppableConfig?.droppable.isSameNode(oldDroppableConfig.droppable) &&
			fixedDraggableElement
		) {
			emitDraggingEvent(fixedDraggableElement, DRAG_EVENT, oldDroppableConfig);
			removeTranslates(oldDroppableConfig.droppable);
			var sortable = oldDroppableConfig.droppable.querySelector(`.${DRAGGING_SORTABLE_CLASS}`);
			if (sortable) {
				removeAtFromElementByDroppableConfig(index, oldDroppableConfig);
			}
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
				!isOutside && droppable.isSameNode(droppableConfigurator.current.droppable)
			);
		}
	};
	const updateConfig = (event: DragMouseTouchEvent, draggableElement: HTMLElement | undefined) => {
		return droppableConfigurator.updateConfig(event, draggableElement);
	};
	const onMove = (event: DragMouseTouchEvent, isTouchEvent: boolean = false) => {
		updateConfig(event, fixedDraggableElement ?? draggableElement);
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
			const movedX = Math.abs(event.touches[0].clientX - initialTouch.x);
			const movedY = Math.abs(event.touches[0].clientY - initialTouch.y);
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
		return draggableAncestor && element.isSameNode(draggableAncestor);
	};
	const getDragStartEventData = (element: Element): DragStartEventData<T> | undefined => {
		const value = config.onGetValue(index);
		return { index, element, value };
	};
	const startTouchMoveEvent = (event: DragMouseTouchEvent) => {
		updateConfig(event, draggableElement);
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
		return updateConfig(event, fixedDraggableElement);
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
		updateConfig(convertedEvent, fixedDraggableElement);
		if (!fixedDraggableElement) {
			return;
		}
		const currentConfig = droppableConfigurator.getCurrentConfig(
			convertedEvent,
			fixedDraggableElement
		);
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
	const createFixedDraggableElement = () => {
		const clonedDraggable = draggableElement.cloneNode(true) as HTMLElement;
		if (clonedDraggable.tagName.toLocaleLowerCase() == 'li') {
			clonedDraggable.style.display = 'block';
		}
		clonedDraggable.style.width = '100%';
		clonedDraggable.style.height = '100%';
		const wrapper = document.createElement('div');
		wrapper.appendChild(clonedDraggable);
		document.body.appendChild(wrapper);
		setDraggingStyles(wrapper);
		return wrapper;
	};
	const startDragging = (event: DragMouseTouchEvent) => {
		fixedDraggableElement = createFixedDraggableElement();
		updateDraggingStateBeforeDragging();
		addClass(draggableElement, DRAGGING_SORTABLE_CLASS);
		emitDraggingEvent(fixedDraggableElement, START_DRAG_EVENT, droppableConfigurator.current);
		updateTransformState(event, draggableElement, fixedDraggableElement);
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
		if (fixedDraggableElement?.classList.contains(DRAGGING_CLASS)) {
			emitDroppingEvent(
				fixedDraggableElement,
				isOutsideAllDroppables ? droppableConfigurator.initial : droppableConfigurator.current,
				windowScroll,
				index
			);
		}
	};
	const removeDraggingStyles = (element: Element) => {
		setTranistion(element, animationDuration, draggableTargetTimingFunction);
		moveTranslate(element, 0, 0);
	};
	const setDraggingStyles = (element: HTMLElement) => {
		const { height, width } = draggableElement.getBoundingClientRect();
		setCustomFixedSize(element, {
			fixedHeight: `${height}px`,
			fixedWidth: `${width}px`
		});
		toggleDraggingClass(element, true);
		toggleClass(element, draggingClass, true);
		element.style.transition = '';
	};
	const removeAfterRemovingClass = (targetIndex: number, config: DroppableConfig<T>) => {
		removeClass(draggableElement, removingClass);
		removeClass(draggableElement, DRAGGING_SORTABLE_CLASS);
		addTempChild(
			draggableElement,
			parent,
			draggingState == DraggingState.START_DRAGGING,
			droppableConfigurator.initial
		);
		emitRemoveEventToSiblings(targetIndex, draggableElement, config, (sibling) => {
			removeDraggingStyles(sibling);
			emitFinishRemoveEventToSiblings(draggableElement);
		});
		onRemoveAtEvent(index, true);
	};
	const removeAtFromElement = (targetIndex: number) => {
		removeAtFromElementByDroppableConfig(targetIndex, droppableConfigurator.initial);
	};
	const removeAtFromElementByDroppableConfig = (
		targetIndex: number,
		droppableConfigurator?: DroppableConfig<T>
	) => {
		if (!droppableConfigurator) {
			return;
		}
		if (targetIndex == index) {
			addClass(draggableElement, removingClass);
			setTimeout(() => {
				removeAfterRemovingClass(targetIndex, droppableConfigurator);
			}, delayBeforeRemove);
		}
	};
	const insertAtFromElement = (targetIndex: number, value: T) => {
		const isLastIndex = targetIndex === config.onGetLegth() && index === targetIndex - 1;
		if (targetIndex === index || isLastIndex) {
			emitInsertEventToSiblings(
				targetIndex,
				draggableElement,
				value,
				droppableConfigurator.initial
			);
		}
	};
	setCssStyles();
	setSlotRefElementParams(draggableElement);
	return [removeAtFromElement, insertAtFromElement] as const;
}

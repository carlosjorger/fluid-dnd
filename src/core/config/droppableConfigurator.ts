import ConfigHandler, { DroppableConfig } from './configHandler';
import { DragMouseTouchEvent } from '../../../index';
import { draggableIsOutside, isSameNode } from '../utils/GetStyles';
import { IsHTMLElement } from '../utils/typesCheckers';
import { setEventWithInterval } from '../utils/SetStyles';
import { getClassesSelector } from '../utils/dom/classList';
import { CoreConfig, DragEndEventData, MapFrom } from '..';

const MapConfig = <T>(coreConfig: DroppableConfig<any>, mapFrom: MapFrom<T>): CoreConfig<any> => {
	const { config, droppable } = coreConfig;
	const { onInsertEvent, onDragEnd } = config;
	const mapOnInsertEvent = (index: number, value: T) => {
		return onInsertEvent(index, mapFrom(value, droppable), true);
	};
	const mapOnDragEnd = (eventData: DragEndEventData<T>) => {
		const { index, value } = eventData;
		onDragEnd({ index, value: mapFrom(value, droppable) });
	};
	return {
		...config,
		onDragEnd: mapOnDragEnd,
		onInsertEvent: mapOnInsertEvent
	};
};

export class DroppableConfigurator<T> {
	initial: DroppableConfig<any> | undefined;
	current: DroppableConfig<T> | undefined;
	private parent: HTMLElement;
	private draggableElement: HTMLElement;
	private groupClass: string | null;
	private dragEvent: () => void;
	private changeDroppable: (
		newdDroppableConfig: DroppableConfig<T> | undefined,
		oldDroppableConfig: DroppableConfig<T> | undefined
	) => void;
	private mapFrom: MapFrom<T>;
	constructor(
		draggableElement: HTMLElement,
		droppableGroupClass: string | null,
		parent: HTMLElement,
		setTransformDragEvent: () => void,
		changeDroppable: (
			newdDroppableConfig: DroppableConfig<T> | undefined,
			oldDroppableConfig: DroppableConfig<T> | undefined
		) => void,
		mapFrom: MapFrom<T>
	) {
		this.parent = parent;
		this.draggableElement = draggableElement;
		this.groupClass = droppableGroupClass;
		this.dragEvent = setTransformDragEvent;
		this.mapFrom = mapFrom;
		this.initial = ConfigHandler.getConfig(parent);
		this.changeDroppable = changeDroppable;
	}
	private getDraggableAncestor(clientX: number, clientY: number, draggable: Element | null) {
		return document
			.elementsFromPoint(clientX, clientY)
			.filter((element) => !isSameNode(draggable, element));
	}
	private getElementBelow(currentElement: HTMLElement, event: DragMouseTouchEvent) {
		const getElementBelow = (config: DroppableConfigurator<T>) => {
			const [elementBelow] = config.getDraggableAncestor(
				event.clientX,
				event.clientY,
				currentElement
			);
			return elementBelow;
		};
		return getElementBelow(this);
	}
	private getCurrent(currentElement: HTMLElement, event: DragMouseTouchEvent) {
		const elementBelow = this.getElementBelow(currentElement, event);
		if (!this.groupClass || !elementBelow) {
			return;
		}
		const currentDroppable = elementBelow.closest(getClassesSelector(this.groupClass));
		return currentDroppable;
	}
	private isOutsideOfAllDroppables(currentElement: HTMLElement) {
		const droppables = this.groupClass
			? Array.from(document.querySelectorAll(getClassesSelector(this.groupClass)))
			: [this.parent];
		return droppables.every((droppable) => draggableIsOutside(currentElement, droppable));
	}
	private isNotInsideAnotherDroppable(currentElement: HTMLElement, droppable: HTMLElement) {
		const isOutside = draggableIsOutside(currentElement, droppable);
		return !isOutside || this.isOutsideOfAllDroppables(currentElement);
	}
	private onScrollEvent() {
		this.dragEvent();
	}
	private setOnScroll(droppable: Element) {
		setEventWithInterval(droppable, 'onscroll', () => {
			this.onScrollEvent();
		});
	}
	getConfigFrom(element: Element) {
		const coreConfig = ConfigHandler.getConfig(element);
		if (!coreConfig) {
			return undefined;
		}
		if (isSameNode(this.parent, element)) {
			return coreConfig;
		}
		return {
			...coreConfig,
			config: MapConfig(coreConfig, this.mapFrom)
		};
	}
	droppableIfInsideCurrent(droppable: Element | null | undefined, current: HTMLElement) {
		return droppable && !isSameNode(current, droppable) && current.contains(droppable);
	}
	getCurrentConfig(event: DragMouseTouchEvent) {
		const currentElement = this.draggableElement;
		const currentDroppable = this.getCurrent(currentElement, event);
		if (
			this.current &&
			this.isNotInsideAnotherDroppable(currentElement, this.current?.droppable) &&
			!this.droppableIfInsideCurrent(currentDroppable, this.current?.droppable)
		) {
			return this.current;
		}
		if (!currentDroppable) {
			return this.getConfigFrom(this.parent);
		}
		if (IsHTMLElement(currentDroppable) && !currentDroppable.onscroll) {
			this.setOnScroll(currentDroppable);
		}
		return this.getConfigFrom(currentDroppable);
	}
	updateConfig(event: DragMouseTouchEvent) {
		const oldDroppableConfig = this.current;
		this.current = this.getCurrentConfig(event);
		this.changeDroppable(this.current, oldDroppableConfig);
	}
	isOutside(event: DragMouseTouchEvent) {
		const currentElement = this.draggableElement;
		return !Boolean(this.getCurrent(currentElement, event));
	}
}

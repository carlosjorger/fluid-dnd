import { DragEndEventData, ListCondig, MapFrom } from '..';
import { Config, CoreConfig, VERTICAL } from '..';
import { DroppableConfig } from '../droppableConfig/configHandler';
import { DRAGGABLE_CLASS } from './classes';

export const getConfig = <T>(listCondig: ListCondig<T>, config?: Config<T>): CoreConfig<T> => {
	const onRemoveAtEvent = (index: number, sync?: boolean) => {
		return listCondig.removeAtEvent(index, sync);
	};

	const onInsertEvent = (index: number, value: T, sync?: boolean) => {
		return listCondig.insertEvent(index, value, sync);
	};

	const onGetLegth = () => {
		return listCondig.getLength();
	};

	const onGetValue = (index: number) => {
		return listCondig.getValue(index);
	};

	const defaultMapFrom = <K>(object: T) => {
		return object as unknown as K;
	};
	return {
		direction: config?.direction ?? VERTICAL,
		handlerSelector: config?.handlerSelector ?? DRAGGABLE_CLASS,
		draggingClass: config?.draggingClass ?? 'dragging',
		droppableClass: config?.droppableClass ?? 'droppable-hover',
		isDraggable: config?.isDraggable ?? (() => true),
		onDragStart: config?.onDragStart ?? (() => {}),
		onDragEnd: config?.onDragEnd ?? (() => {}),
		droppableGroup: config?.droppableGroup,
		onRemoveAtEvent,
		onInsertEvent,
		onGetLegth,
		onGetValue,
		animationDuration: config?.animationDuration ?? 200,
		removingClass: config?.removingClass ?? 'removing',
		insertingFromClass: config?.insertingFromClass ?? 'from-inserting',
		delayBeforeRemove: config?.delayBeforeRemove ?? 200,
		delayBeforeInsert: config?.delayBeforeInsert ?? 200,
		mapFrom: config?.mapFrom ?? defaultMapFrom,
		delayBeforeTouchMoveEvent: config?.delayBeforeTouchMoveEvent ?? 150,
		coordinateTransform: config?.coordinateTransform ?? [(coordinate) => coordinate]
	};
};
export const MapConfig = <T>(
	coreConfig: DroppableConfig<any>,
	mapFrom: MapFrom<T>
): CoreConfig<any> => {
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

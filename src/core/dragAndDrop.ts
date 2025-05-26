import { CoreConfig, ListCondig, VERTICAL } from '.';
import { Config } from '.';
import useDroppable from './useDroppable';
import HandlerPublisher from './HandlerPublisher';
import ConfigHandler from './config/configHandler';
import { isTempElement, observeMutation } from './utils/observer';
import { addClass } from './utils/dom/classList';
import { DRAGGABLE_CLASS, DROPPABLE_CLASS } from './utils/classes';

const getConfig = <T>(listCondig: ListCondig<T>, config?: Config<T>): CoreConfig<T> => {
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

export default function dragAndDrop<T>(
	listCondig: ListCondig<T>,
	handlerPublisher: HandlerPublisher,
	config?: Config<T>,
	indexAttr: string = 'index'
) {
	let removeAtFromElements = [] as ((index: number) => void)[];
	let insertAtFromElements = [] as ((index: number, value: T) => void)[];
	let currentObserver: MutationObserver;
	const coreConfig = getConfig(listCondig, config);

	const removeAt = (index: number) => {
		for (const removeAtFromElement of removeAtFromElements) {
			removeAtFromElement(index);
		}
	};
	const insertAt = (index: number, value: T) => {
		const listLegth = coreConfig.onGetLegth();
		if (listLegth === 0) {
			listCondig.insertToListEmpty(coreConfig, index, value);
		} else {
			for (const insertAtFromElement of insertAtFromElements) {
				insertAtFromElement(index, value);
			}
		}
	};
	const makeChildrensDraggable = (parent: HTMLElement | undefined) => {
		const [removeAtFromElementList, insertAtFromElementList] = useDroppable(
			coreConfig,
			handlerPublisher,
			parent,
			indexAttr
		);
		removeAtFromElements = removeAtFromElementList;
		insertAtFromElements = insertAtFromElementList;
	};
	const childrenMutationFilter = (mutation: MutationRecord) => {
		const addedNodes = mutation.addedNodes
			.values()
			.filter((element) => !isTempElement(element))
			.toArray();
		const removedNodes = mutation.removedNodes
			.values()
			.filter((element) => !isTempElement(element))
			.toArray();
		return addedNodes.length > 0 || removedNodes.length > 0;
	};
	const observeChildrens = (parent: HTMLElement) => {
		currentObserver = observeMutation(
			() => {
				makeChildrensDraggable(parent);
			},
			parent,
			{ childList: true },
			childrenMutationFilter
		);
	};
	const makeDroppable = (parent: HTMLElement) => {
		addClass(parent, DROPPABLE_CLASS);
	};
	const addConfigHandler = (parent: HTMLElement) => {
		ConfigHandler.addConfig(parent, coreConfig);
	};
	const onChangeParent = (parent: HTMLElement | null | undefined) => {
		if (!parent) {
			return;
		}
		makeDroppable(parent);
		addConfigHandler(parent);
		observeChildrens(parent);
		makeChildrensDraggable(parent);
		ConfigHandler.removeObsoleteConfigs();
		return currentObserver;
	};
	return [removeAt, insertAt, onChangeParent] as const;
}

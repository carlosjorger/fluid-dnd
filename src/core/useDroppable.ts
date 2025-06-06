import { parseIntEmpty } from './utils/GetStyles';
import { CoreConfig } from '.';
import { addMultipleClasses, getClassesList } from './utils/dom/classList';
import HandlerPublisher from './HandlerPublisher';
import useDraggable from './useDraggable';
import { AddCssStylesToElement } from './utils/SetStyles';
import {
	DRAGGABLE_CLASS,
	DRAGGING_CLASS,
	DRAGGING_HANDLER_CLASS,
	DRAGGING_SORTABLE_CLASS,
	DROPPING_CLASS,
	GRAB_CLASS,
	GRABBING_CLASS,
	HANDLER_CLASS
} from './utils/classes';

const setDroppableGroupClass = (droppableGroupClass: string, droppable: HTMLElement) => {
	if (droppableGroupClass) {
		addMultipleClasses(droppable, droppableGroupClass);
	}
};
const createDraggableCssStyles = () => {
	AddCssStylesToElement(document.body, [
		`.${DRAGGABLE_CLASS}{touch-action:manipulation;user-select:none;box-sizing:border-box!important;-webkit-user-select:none;}`,
		`.${HANDLER_CLASS}{pointer-events:auto!important;}`,
		`.${GRAB_CLASS}{cursor:grab;}`,
		'.temp-child{touch-action:none;pointer-events:none;box-sizing:border-box!important;}',
		`.droppable{box-sizing:border-box!important;}`,
		`.${DRAGGING_CLASS}{position:fixed;z-index:5000;width:var(--fixedWidth)!important;height:var(--fixedHeight)!important;}`,
		`.${DRAGGING_SORTABLE_CLASS}{opacity:0.3;}`,
		`.${DRAGGING_HANDLER_CLASS}{pointer-events:none!important;}`,
		`.${DROPPING_CLASS}{pointer-events:none!important;}`,
		`.${GRABBING_CLASS}{cursor:grabbing;}`,
		`.disable-transition{transition:none!important;}`
	]);
};
export default function useDroppable<T>(
	coreConfig: CoreConfig<T>,
	handlerPublisher: HandlerPublisher,
	droppable?: HTMLElement,
	indexAttr: string = 'index'
) {
	const INDEX_ATTR = indexAttr;
	let removeAtFromElementList = [] as ((targetIndex: number) => void)[];
	let insertAtFromElementList = [] as ((targetIndex: number, value: T) => void)[];
	const { droppableGroup } = coreConfig;
	if (!droppable) {
		return [removeAtFromElementList, insertAtFromElementList] as const;
	}
	const droppableGroupClass = getClassesList(droppableGroup)
		.map((classGroup) => `droppable-group-${classGroup}`)
		.join(' ');
	createDraggableCssStyles();
	setDroppableGroupClass(droppableGroupClass, droppable);
	for (const child of droppable.children) {
		const index = child.getAttribute(INDEX_ATTR);
		const numberIndex = parseIntEmpty(index);
		const childHTMLElement = child as HTMLElement;
		if (childHTMLElement && numberIndex >= 0) {
			const [removeAtFromElement, insertAtFromElement] = useDraggable(
				childHTMLElement,
				numberIndex,
				coreConfig,
				droppable,
				handlerPublisher
			);
			removeAtFromElementList.push(removeAtFromElement);
			insertAtFromElementList.push(insertAtFromElement);
		}
	}
	return [removeAtFromElementList, insertAtFromElementList] as const;
}

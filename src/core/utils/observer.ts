import { TEMP_CHILD_CLASS } from '.';
import { IsHTMLElement } from './typesCheckers';

export const observeMutation = (
	callback: (observer: MutationObserver, mutation: MutationRecord) => void,
	element: Element,
	options?: MutationObserverInit,
	mutationFilter: (mutation: MutationRecord) => boolean = () => true
) => {
	const observe = new MutationObserver((mutations) => {
		mutations = mutations.filter(mutationFilter);
		if (mutations.length > 0) {
			const mutation = mutations[0];
			callback(observe, mutation);
		}
	});
	observe.observe(element, options);
	return observe;
};
export const isTempElement = (element: Node) => {
	if (!IsHTMLElement(element)) {
		return false;
	}
	return element.classList.contains(TEMP_CHILD_CLASS);
};

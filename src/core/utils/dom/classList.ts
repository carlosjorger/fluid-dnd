export const containClass = (element: Element, cssClass: string) => {
	return element.classList.contains(cssClass);
};
export const toggleClass = (element: Element, cssClass: string, force: boolean = false) => {
	element.classList.toggle(cssClass, force);
};
export const addClass = (element: Element, cssClass: string) => {
	element.classList.add(cssClass);
};
export const removeClass = (element: Element, cssClass: string) => {
	element.classList.remove(cssClass);
};
export const containstClasses = (element: HTMLElement, classes: string) => {
	return getClassesList(classes).every((cssClass) => containClass(element, cssClass));
};
export const getClassesSelector = (classes: string) => {
	const classesSelector = getClassesList(classes).join('.');
	return `.${classesSelector}`;
};
export const addMultipleClasses = (element: HTMLElement, classes: string) => {
	const classesList = getClassesList(classes);
	element.classList.add(...classesList);
};
export const getClassesList = (classes: string | null | undefined) => {
	return (classes?.split(' ') ?? []).filter((cssClass) => cssClass);
};

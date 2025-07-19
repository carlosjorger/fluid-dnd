import { ElementScroll } from '../../../index';
import { CoreConfig } from '..';
import { getScrollElement, isSameNode } from '../utils/GetStyles';
import { containstClasses } from '../utils/dom/classList';

export type DroppableConfig<T> = {
	droppable: HTMLElement;
	config: CoreConfig<T>;
	scroll: ElementScroll;
};
export default class ConfigHandler {
	static configs = [] as DroppableConfig<any>[];
	static addConfig<T>(droppable: HTMLElement, config: CoreConfig<T>) {
		const configs = ConfigHandler.configs.filter(
			(configHandler) => !isSameNode(configHandler.droppable, droppable)
		);
		const scroll = getScrollElement(droppable);
		configs.push({
			droppable,
			config,
			scroll
		});
		ConfigHandler.configs = configs;
	}
	static removeObsoleteConfigs = () => {
		const notObsoltete = ConfigHandler.configs.filter(({ droppable }) =>
			document.contains(droppable)
		);
		ConfigHandler.configs = notObsoltete;
	};
	static updateScrolls(currentDroppable: Element, droppableGroupClass: string | null) {
		for (const configHandler of ConfigHandler.configs) {
			const { droppable } = configHandler;
			if (
				(droppableGroupClass && containstClasses(droppable, droppableGroupClass)) ||
				isSameNode(currentDroppable, droppable)
			) {
				configHandler.scroll = getScrollElement(droppable);
			}
		}
	}
	static getConfig(curerntDroppable: Element) {
		const config = ConfigHandler.configs.find(({ droppable }) =>
			isSameNode(curerntDroppable, droppable)
		);
		return config;
	}
}

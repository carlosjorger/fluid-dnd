import { insertToListEmpty } from '../../core/events/insert';
import { CoreConfig } from '../../core';
import { ListCondig } from '../../core';

export class SvelteListCondig<T> implements ListCondig<T> {
	private items: T[];
	private parent: HTMLElement | undefined;
	constructor(items: T[]) {
		this.items = items;
	}
	setParent(parent: HTMLElement | undefined) {
		this.parent = parent;
	}
	removeAtEvent(index: number) {
		const listValue = this.items;
		if (listValue.length <= 0) {
			return;
		}
		const [deletedItem] = listValue.splice(index, 1);
		return deletedItem;
	}
	insertEvent(index: number, value: T) {
		const listValue = this.items;
		listValue.splice(index, 0, value);
	}
	getLength() {
		return this.items.length;
	}
	getValue(index: number) {
		return this.items[index];
	}
	insertToListEmpty(config: CoreConfig<T>, index: number, value: T) {
		insertToListEmpty(config, this.parent, index, value);
	}
}

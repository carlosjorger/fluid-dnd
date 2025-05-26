import { CoreConfig } from '../../core';
import { ListCondig } from '../../core';
// @ts-ignore
import { Ref } from 'vue';
import { getLength, getValue, onInsertEventOnList, removeAtEventOnList } from './DropMethods';
import { insertToListEmpty } from '../../core/events/insert';

export class VueListCondig<T> implements ListCondig<T> {
	private items: Ref<T[]>;
	private parent: Ref<HTMLElement | undefined>;
	constructor(items: Ref<T[]>, parent: Ref<HTMLElement | undefined>) {
		this.items = items;
		this.parent = parent;
	}
	removeAtEvent(index: number) {
		return removeAtEventOnList(this.items, index);
	}
	insertEvent(index: number, value: T) {
		return onInsertEventOnList(this.items, index, value);
	}
	getLength() {
		return getLength(this.items);
	}
	getValue(index: number) {
		return getValue(this.items, index);
	}
	insertToListEmpty(config: CoreConfig<T>, index: number, value: T) {
		insertToListEmpty(config, this.parent.value, index, value);
	}
}

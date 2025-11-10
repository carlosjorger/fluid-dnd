import { writable, type Writable } from 'svelte/store';

export interface NumberItem {
	id: number;
	value: number;
}

export interface NumberContextType {
	numbers: Writable<NumberItem[]>;
	addNumber: (value: number) => void;
	removeNumber: (id: number) => void;
	updateNumber: (id: number, newValue: number) => void;
	clearNumbers: () => void;
}

function createNumberContext(): NumberContextType {
	const numbers = writable<NumberItem[]>([]);
	let nextId = 1;

	return {
		numbers,
		addNumber: (value: number) => {
			numbers.update(current => [...current, { id: nextId++, value }]);
		},
		removeNumber: (id: number) => {
			numbers.update(current => current.filter(item => item.id !== id));
		},
		updateNumber: (id: number, newValue: number) => {
			numbers.update(current => 
				current.map(item => 
					item.id === id ? { ...item, value: newValue } : item
				)
			);
		},
		clearNumbers: () => {
			numbers.set([]);
		}
	};
}

export const numberContext = createNumberContext();

<script lang="ts">
	import { setContext } from 'svelte';
	import { numberContext } from '../lib/numberContext';
	import useDragAndDrop from '../../../../src/svelte/useDragAndDrop.ts';
	import '../app.css';
	import { derived } from 'svelte/store';

    // numberContext.addNumber(1);
    // numberContext.addNumber(2);
    // numberContext.addNumber(3);
	// Set the context for child components
	setContext('numberContext', numberContext);

	// Get the numbers store from the context
	const numbersStore = numberContext.numbers;

	// Subscribe to the numbers store
	const numbers = $derived($numbersStore);

	// Drag and drop functions

                
	// Initialize fluid-dnd with the numbers array
	const [dragAndDropAction] = $derived(useDragAndDrop(numbers, {
            removingClass: "removed",
            delayBeforeRemove: 400,
        }));

	// Local state for new number input
	let newNumberInput = '';


	function addNumber() {
		const value = parseInt(newNumberInput);
		if (!isNaN(value)) {
			numberContext.addNumber(value);
			newNumberInput = '';
		}
	}

	function removeNumber(id: number) {
		numberContext.removeNumber(id);
	}

	function updateNumber(id: number, newValue: number) {
		numberContext.updateNumber(id, newValue);
	}

	function clearAll() {
		numberContext.clearNumbers();
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addNumber();
		}
	}

</script>

<div class="number-list-container">
	<h2 class="text-xl font-bold mb-4 text-slate-200">Number List with Context & Drag & Drop</h2>
	
	<!-- Add new number section -->
	<div class="add-number-section mb-4">
		<div class="flex gap-2 mb-2">
			<input
				type="number"
				bind:value={newNumberInput}
				on:keypress={handleKeyPress}
				placeholder="Enter a number"
				class="flex-1 px-3 py-2 bg-slate-600 text-slate-200 rounded-md border border-slate-500 focus:outline-none focus:border-slate-400"
			/>
			<button
				on:click={addNumber}
				class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
			>
				Add
			</button>
		</div>
	</div>

	<!-- Numbers list with drag and drop -->
	<ul class="numbers-list" use:dragAndDropAction>
		{#each numbers as numberItem, index (numberItem.id)}
			<li class="number-item" data-index={index}>
				<div class="number-content">
					<span class="number-value">{numberItem.value}</span>
					<div class="number-actions">
						<button
							on:click={() => updateNumber(numberItem.id, numberItem.value + 1)}
							class="action-btn increment-btn"
							title="Increment"
						>
							+
						</button>
						<button
							on:click={() => updateNumber(numberItem.id, Math.max(0, numberItem.value - 1))}
							class="action-btn decrement-btn"
							title="Decrement"
						>
							−
						</button>
						<button
							on:click={() => removeNumber(numberItem.id)}
							class="action-btn remove-btn"
							title="Remove"
						>
							×
						</button>
					</div>
				</div>
			</li>
		{/each}
	</ul>

	<!-- Drag & Drop Info -->
	<div class="drag-drop-info mb-4 p-3 bg-slate-700 rounded-md border border-slate-600">
		<h3 class="text-sm font-semibold text-slate-300 mb-2">Drag & Drop Features:</h3>
		<ul class="text-xs text-slate-400 space-y-1">
			<li>• Drag numbers to reorder them in the list</li>
			<li>• Drop numbers to insert them at new positions</li>
			<li>• Smooth animations during drag operations</li>
			<li>• Visual feedback with hover effects</li>
		</ul>
	</div>

	<!-- Controls -->
	<div class="controls mt-4">
		<button
			on:click={clearAll}
			class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
		>
			Clear All
		</button>
		<span class="ml-4 text-slate-300">
			Total numbers: {numbers?.length || 0}
		</span>
	</div>
</div>

<style>
	.number-list-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
	}

	.numbers-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.number-item {
		background: linear-gradient(135deg, #475569, #334155);
		border: 1px solid #475569;
		border-radius: 8px;
		margin-bottom: 0.5rem;
		transition: background-color 0.2s ease;
		cursor: grab;
	}

	.number-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.number-item:active {
		cursor: grabbing;
	}

	.number-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}

	.number-value {
		font-size: 1.25rem;
		font-weight: 600;
		color: #e2e8f0;
		min-width: 60px;
	}

	.number-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 6px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.increment-btn {
		background-color: #059669;
		color: white;
	}

	.increment-btn:hover {
		background-color: #047857;
		transform: scale(1.1);
	}

	.decrement-btn {
		background-color: #dc2626;
		color: white;
	}

	.decrement-btn:hover {
		background-color: #b91c1c;
		transform: scale(1.1);
	}

	.remove-btn {
		background-color: #7c2d12;
		color: white;
	}

	.remove-btn:hover {
		background-color: #9a3412;
		transform: scale(1.1);
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.add-number-section input:focus {
		box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.3);
	}

	/* Drag and drop styles */
	:global(.number-item.removed) {
		opacity: 0;
		transform: scale(0.8);
	}

	:global(.number-item.from-inserting) {
		opacity: 0;
		transform: scale(0.9);
	}

	:global(.number-item.dragging) {
		opacity: 0.7;
		transform: rotate(5deg);
		z-index: 1000;
	}

	:global(.number-item.drag-over) {
		border-color: #059669;
		background: linear-gradient(135deg, #065f46, #047857);
	}
</style>

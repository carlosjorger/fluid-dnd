<script lang="ts">
	import { getContext } from 'svelte';
	import type { NumberContextType, NumberItem } from '../lib/numberContext';

	// Get the context from the parent component
	const numberContext = getContext<NumberContextType>('numberContext');

	// Get the numbers store from the context
	const numbersStore = numberContext?.numbers;

	// Subscribe to the numbers store
	$: numbers = $numbersStore;

	// Calculate some statistics
	$: total = numbers?.reduce((sum: number, item: NumberItem) => sum + item.value, 0);
	$: average = numbers?.length > 0 ? total / numbers.length : 0;
	$: maxNumber = numbers?.length > 0 ? Math.max(...numbers.map((item: NumberItem) => item.value)) : 0;
	$: minNumber = numbers?.length > 0 ? Math.min(...numbers.map((item: NumberItem) => item.value)) : 0;
</script>

<div class="context-consumer">
	<h3 class="text-lg font-semibold mb-3 text-slate-200">Context Consumer Component</h3>
	
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-label">Total Numbers</div>
			<div class="stat-value">{numbers?.length}</div>
		</div>
		
		<div class="stat-card">
			<div class="stat-label">Sum</div>
			<div class="stat-value">{total}</div>
		</div>
		
		<div class="stat-card">
			<div class="stat-label">Average</div>
			<div class="stat-value">{average.toFixed(2)}</div>
		</div>
		
		<div class="stat-card">
			<div class="stat-label">Max</div>
			<div class="stat-value">{maxNumber}</div>
		</div>
		
		<div class="stat-card">
			<div class="stat-label">Min</div>
			<div class="stat-value">{minNumber}</div>
		</div>
	</div>

	<div class="info-text">
		This component consumes the number context and displays real-time statistics.
		It automatically updates when the parent component modifies the number list.
	</div>
</div>

<style>
	.context-consumer {
		background: linear-gradient(135deg, #1e293b, #0f172a);
		border: 1px solid #334155;
		border-radius: 12px;
		padding: 1.5rem;
		margin-top: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: linear-gradient(135deg, #334155, #1e293b);
		border: 1px solid #475569;
		border-radius: 8px;
		padding: 1rem;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
	}

	.stat-label {
		font-size: 0.875rem;
		color: #94a3b8;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #e2e8f0;
	}

	.info-text {
		color: #94a3b8;
		font-size: 0.875rem;
		line-height: 1.5;
		text-align: center;
		font-style: italic;
	}
</style>

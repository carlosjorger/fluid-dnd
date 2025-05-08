<script lang="ts">
	import '../app.css';
   
   import useDragAndDrop from '../../../../src/svelte/useDragAndDrop.ts';
	import NestedDroppables from './nestedDroppables.svelte';
   
	let numbers = $state([1, 2, 3, 5, 6, 7, 8, 9, 10]);
   const [dragAnDrop] = useDragAndDrop(numbers,{
        direction: 'horizontal',
        droppableGroup: 'nested-group'
   });
</script>
<div class="m-4">
    <div class="bg-slate-700 flex gap-2 p-2 mb-2 overflow-auto max-w-2xl" use:dragAnDrop>
       {#each numbers as number, index (number)}
          <div class="bg-slate-400 number min-w-20" data-index={index}>
             {number}
          </div>
       {/each}
    </div>
    <NestedDroppables/>
</div>

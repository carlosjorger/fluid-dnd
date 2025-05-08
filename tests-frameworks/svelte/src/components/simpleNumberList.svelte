<script lang="ts">
	import '../app.css';
   
   import useDragAndDrop from '../../../../src/svelte/useDragAndDrop.ts';
	let numbers = $state([1, 2, 3]);
   const [dragAnDrop, insertAt, removeAt] = useDragAndDrop(numbers,{
      removingClass: "removed",
      delayBeforeRemove: 400,
   });
   const RemoveFirst = () => {
      if (numbers.length > 0) {
         removeAt(0);
      }
   }
   const Append=()=>{
      const maxNumber = (numbers.length>0?Math.max(...numbers):0)
      insertAt(numbers.length,maxNumber+1)
   }
</script>

<ul class="bg-slate-700 flex flex-col gap-2 max-w-2xl p-2 mb-2" use:dragAnDrop>
   {#each numbers as number, index (number)}
      <li class="bg-slate-400 number" data-index={index}>
         {number}
      </li>
   {/each}
</ul>
<div class="flex justify-between max-w-2xl">
   <button class="bg-slate-400 p-2 rounded-md hover:bg-slate-600 w-xs" onclick={RemoveFirst}>Remove first</button>
   <button class="bg-slate-400 p-2 rounded-md hover:bg-slate-600 w-xs" onclick={Append}>Append</button>

</div>
<style>
   .number {
      opacity: 1;
      transition: opacity 200ms ease;
   }
   :global(.number.removed) {
      opacity: 0;
   }
   :global(.number.from-inserting){
      opacity: 0;
   }
</style>

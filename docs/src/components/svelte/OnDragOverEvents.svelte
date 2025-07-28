<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
import { type DragOverEventData } from "../../../../src/core";

const list = $state([1, 2, 3, 4]);
let droppableGroup = $state<HTMLElement|null>(null)
let currentDragOver = $state<string>('')

function onDragStart(){
  const droppables = droppableGroup?.querySelectorAll('.droppable-group-group1')??[]
  for (const droppable of [...droppables]) {
    droppable.classList.toggle('marked-droppable',true)
  }
  currentDragOver = ''
}

function onDragEnd (){
  const droppables = droppableGroup?.querySelectorAll('.droppable-group-group1')??[]
  for (const droppable of [...droppables]) {
    droppable.classList.toggle('marked-droppable',false)
  }
  currentDragOver = ''
}

function onDragOver(data: DragOverEventData<number>){
  const droppableElement = data.droppable as HTMLElement
  const droppableId = droppableElement.id || 'Unknown'
  currentDragOver = `Dragging ${data.value} over ${droppableId} at position ${data.targetIndex}`
}

const [ parent1 ] = useDragAndDrop<number>(list, {
  droppableGroup: "group1",
  onDragStart,
  onDragEnd,
  onDragOver,
});

const list2 = $state([5, 6, 7, 8]);
const [ parent2 ] = useDragAndDrop(list2, { 
  droppableGroup: "group1",
  direction: "horizontal",
  onDragStart,
  onDragEnd,
  onDragOver,
});
</script>

<div class="my-6">
  <h4>Current drag over: <span class="!text-[var(--sl-color-white)]">{currentDragOver || 'None'}</span></h4>
</div>

<div bind:this={droppableGroup} class="group-list bg-[var(--sl-color-gray-6)]">
  <h5 class="mb-2">List 1</h5>
  <ul use:parent1 id="list1" class="number-list">
    {#each list as element, index (element) }
      <li class="number" data-index={index}>
        { element }
      </li>
    {/each}
  </ul>
  <h5 class="mb-2">List 2</h5>
  <div use:parent2 id="list2" class="number-list-h">
    {#each list2 as element, index (element) }
      <div
        class="number"
        data-index={index}
      >
        { element }
      </div>
    {/each}
  </div>
</div>

<style>
.number {
  border-style: solid;
  padding-left: 10px;
  padding-block: 5px;
  margin-top: 0.25rem !important;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  color: var(--sl-color-gray-2);
  min-width: 120px;
  width: 120px;
}

.number-list {
  display: block;
  height: 290px;
  overflow-y: auto;
  background-color: var(--sl-color-gray-5);
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: border-color 200ms ease;
}

.number-list-h {
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  padding-inline: 25px;
  margin-top: 0 !important;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: border-color 200ms ease;
}

.temp-child {
  margin-top: 0 !important;
}

.marked-droppable{
    border: 2px solid white;
}
</style> 
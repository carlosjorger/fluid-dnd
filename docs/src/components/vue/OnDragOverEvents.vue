<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import { type DragOverEventData } from "fluid-dnd";

const droppableGroup = useTemplateRef('droppableGroup')
const currentDragOver = ref<string>('')

function onDragStart(){
  const droppables = droppableGroup.value?.querySelectorAll('.droppable-group-group1')??[]
  for (const droppable of [...droppables]) {
    droppable.classList.toggle('marked-droppable',true)
  }
  currentDragOver.value = ''
}

function onDragEnd (){
  const droppables = droppableGroup.value?.querySelectorAll('.droppable-group-group1')??[]
  for (const droppable of [...droppables]) {
    droppable.classList.toggle('marked-droppable',false)
  }
  currentDragOver.value = ''
}

function onDragOver(data: DragOverEventData<number>){
  const droppableElement = data.droppable as HTMLElement
  const droppableId = droppableElement.id || 'Unknown'
  currentDragOver.value = `Dragging ${data.value} over ${droppableId} at position ${data.targetIndex}`
}

const list1 = ref([1, 2, 3, 4]);
const [ parent1 ] = useDragAndDrop<number>(list1, {
  droppableGroup: "group1",
  onDragStart,
  onDragEnd,
  onDragOver,
});

const list2 = ref([5, 6, 7, 8]);
const [ parent2 ] = useDragAndDrop<number>(list2, { 
  droppableGroup: "group1",
  direction: "horizontal",
  onDragStart,
  onDragEnd,
  onDragOver,
});
</script>

<template>
  <div class="my-6">
    <h4>Current drag over: <span class="!text-[var(--sl-color-white)]">{{ currentDragOver || 'None' }}</span></h4>
  </div>
  <div ref="droppableGroup" class="group-list bg-[var(--sl-color-gray-6)]">
    <h5 class="mb-2">List 1</h5>
    <ul ref="parent1" id="list1" class="number-list">
      <li class="number" v-for="(element, index) in list1" :index :key="element">
        {{ element }}
      </li>
    </ul>
    <h5 class="mb-2">List 2</h5>
    <div ref="parent2" id="list2" class="number-list-h">
      <div
        class="number"
        v-for="(element, index) in list2"
        :index
        :key="element"
      >
        {{ element }}
      </div>
    </div>
  </div>
</template>

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
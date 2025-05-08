<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
import Droppable from "./Droppable.vue";

const droppables = ref(['A', 'B']);
const [ parent, insertAt ] = useDragAndDrop<string>(droppables as any, {
  direction: "horizontal",
});
const dict={
  'A':[],
  'B':['d', 'e', 'f']
} as {
  [key: string]: string[]
}
const { id } = defineProps<{
  id: string;
}>();
function addDroppable(){
  const lasValue = [...Object.keys(dict)].pop()
  const ansiCode = lasValue?.charCodeAt(0)??0
  const newValueCode = ansiCode+1
  const newValue = String.fromCharCode(newValueCode)
  dict[newValue]=[]
  insertAt(droppables.value.length, newValue)
}
</script>
<template>
  <div ref="parent" :id="id" class="list">
    <div
      v-for="(element, index) in droppables"
      :index="index"
      :id="'horizontal-child-' + element"
      class="droppable-child"
      :key="element"
    >
      {{ element }}
      <Droppable :elements="dict[element]" droppableGroup="nested-group"/>
    </div>
  </div>
  <button @click="addDroppable">Add droppable</button>
</template>
<style scoped>
.list {
  display: flex;
  padding: 10px;
  flex-direction: row;
}
.droppable-child {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 200px;
  transition: opacity 400ms ease;
}
.droppable-child.from-inserting{
  opacity: 0;
}
</style>

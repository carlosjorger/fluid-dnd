<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";

const numbers1 = ref([1, 2, 3, 4, 5, 6]);
const [ parent1 ] = useDragAndDrop<number>(numbers1 as any, {
  direction: "vertical",
  droppableGroup: "group1",
  draggingClass: 'dragging-group',
});

const numbers2 = ref([7, 8, 9, 10, 11, 12, 13, 14, 15]);
const [ parent2 ] = useDragAndDrop<number>(numbers2 as any, {
  direction: "vertical",
  droppableGroup: "group1",
  draggingClass: 'dragging-group',
});

const { id } = defineProps<{
  id: string;
}>();
</script>
<template>
  <div :id class="group">
    <div ref="parent1" class="vertical-list">
      <div
        v-for="(element, index) in numbers1"
        :index="index"
        :id="'group-child-' + +element.toString()"
        class="number"
        :key="element"
      >
        {{ element }}
      </div>
    </div>
    <ul ref="parent2" class="scrolled-list">
      <li
        v-for="(element, index) in numbers2"
        :index="index"
        :id="'group-child-' + +element.toString()"
        class="number"
        :key="element"
      >
        {{ element }}
      </li>
    </ul>
  </div>
</template>
<style scoped>
.group {
  display: grid;
  grid-template-areas:
    "vertical scrolled"
    "horizontal  horizontal";
  gap: 10%;
  margin-bottom: 15%;
}
.vertical-list {
  background-color:antiquewhite;
  height: 400px;
  grid-area: vertical;
  transition: background-color 150ms ease-in;
}
.vertical-list.droppable-hover{
  background-color:burlywood ;
}
.scrolled-list {
  padding-block: 20px;
  background-color: antiquewhite;
  height: 420px;
  overflow: auto;
  display: block;
  padding-inline: 25px;
  grid-area: scrolled;
  transition: background-color 150ms ease-in;
}
.scrolled-list.droppable-hover{
  background-color:burlywood ;
}
.horizontal-list {
  display: flex;
  padding: 10px;
  flex-direction: row;
  background-color: pink;
  padding: 40px;
  grid-area: horizontal;
  overflow: auto;
  max-width: 600px;
  height: 150px;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  min-width: 100px;
  max-width: 100px;
  background-color: aqua;
  transition: background-color 800ms ease-in;
}
.number.dragging-group {
  background-color: blue;
 }
.number.nested {
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  align-items: center;
}
.number-list {
  display: block;
  padding-inline: 25px;
}
.number-list-h {
  display: flex;
  padding-inline: 25px;
}
</style>

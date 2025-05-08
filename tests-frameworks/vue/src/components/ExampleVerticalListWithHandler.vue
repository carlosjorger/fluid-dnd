<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
const numbers = ref([1, 2, 3, 4, 5, 6]);

const { id } = defineProps<{
  id: string;
}>();
const [ parent ] = useDragAndDrop<number>(numbers as any, {
  handlerSelector: ".drag-handle",
});
</script>
<template>
  <ul ref="parent" :id="id" class="vertical-list">
    <li
      v-for="(element, index) in numbers"
      :index="index"
      :id="'child-with-children-' + +element.toString()"
      class="number"
      :key="element"
    >
      <div class="draggable-wrapper">
        <div class="drag-handle">
          <div><div>☰</div></div>
        </div>
        <div>{{ element }}</div>
      </div>
    </li>
  </ul>
</template>
<style>
.draggable-wrapper {
  border-width: 10px;
  border-style: solid;
  margin: 2px;
  padding-inline: 4px;
  padding-block: 5px;
}
.vertical-list {
  display: block;
  padding-inline: 10px;
  padding-block: 5px;
}
.number {
  padding-left: 10px;
  padding-right: 20px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 60%;
}
.drag-handle {
  float: left;
  padding: 0px 50px;
  background-color: rgba(225, 225, 225, 0.2);
}
</style>

<script setup lang="ts">
import { PropType, ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
import { DragEndEventData, DragStartEventData } from "../../../../src/core";

const list = ref([] as string[])
const { droppableGroup, elements, onDragEnd, onDragOver, onDragStart } = defineProps({
    droppableGroup: String,
    elements: {
      type: Array<string>,
      required: true
    },
    onDragEnd: {
      type: Function as PropType<(data: DragEndEventData<string>) => void>,
      default: () => {}
    },
    onDragStart: {
      type: Function as PropType<(data: DragEndEventData<string>) => void>,
      default: () => {}
    },
    onDragOver: {
      type: Function as PropType<(data: DragStartEventData<string>) => void>,
      default: () => {}
    },
});
list.value = elements
const [ parent ] = useDragAndDrop<string>(list as any,
  {
    droppableGroup,
    onDragEnd,
    onDragStart,
    onDragOver
  }
);
</script>
<template>
    <ul ref="parent" class="vertical-list">
        <li
        v-for="(element, index) in list"
        :index="index"
        class="number"
        :value="element"
        >
        <div>{{ element }}</div>
        </li>
    </ul>
</template>
<style scoped>
.vertical-list {
  display: block;
  padding-inline: 10px;
  min-height: 200px;
  background-color: rgba(255, 255, 255, 0.2);
  border-width: 0.2rem;
  border-color: transparent;
  border-style: solid;
  transition: border-color 300ms ease;

}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  margin: 5px;
}
</style>
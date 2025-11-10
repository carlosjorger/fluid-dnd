<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
const numbers = ref([
  { label: "a", value: 1 },
  { label: "b", value: 2 },
  { label: "c", value: 3 },
  { label: "d", value: 4 },
  { label: "e", value: 5 },
  { label: "f", value: 6 },
]);

const { id } = defineProps<{
  id: string;
}>();
 const toggleChildrenClass = (element :HTMLElement | undefined, className: string, force?: boolean)=>{
  const children = element?.children
    if(children){
      for (const child of children) {
       child.classList.toggle(className, force) 
      }
    }
}
const [parent] = useDragAndDrop<number>(numbers as any, {
  draggingClass: "dragging-number",
  droppableClass: "hover",
  onDragStart: () => {
    toggleChildrenClass(parent.value, 'transition-transform', false)
  },
  onDragEnd: () => {
    toggleChildrenClass(parent.value, 'transition-transform', true)
  }
});
const triggerClick = () => {
  console.log("click");
};
</script>
<template>
  <ul ref="parent" :id="id" class="vertical-list">
    <li
      v-for="(element, index) in numbers"
      :index="index"
      :id="'child-with-children-' +element.label.toString()"
      :key="element.value"
      class="number hover:-translate-y-2 transition-transform"
    >
      {{ element.label }}
      <div style="display: flex; flex-direction: column">
        <input type="number" v-model="element.value" @click="triggerClick" />
      </div>
    </li>
  </ul>
</template>
<style scoped>
.vertical-list {
  display: block;
  padding-inline: 10px;
  transform-origin: 0 0
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>

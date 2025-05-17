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
const [parent] = useDragAndDrop<number>(numbers as any);
const triggerClick = () => {
  console.log("click");
};
</script>
<template>
  <ul ref="parent" :id="id" class="vertical-list">
    <li
      v-for="(element, index) in numbers"
      :index="index"
      :id="'child-with-children-' + +element.label.toString()"
      class="number"
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
  transform: scale(1.2);
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

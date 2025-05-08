<script setup lang="ts">
import { ref } from "vue";
import NumberComponent from "./NumberComponent.vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";

const numbers = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
]);

defineProps<{
  id: string;
}>();

const [ parent ] = useDragAndDrop<number>(numbers as any);
</script>
<template>
  <ul ref="parent" class="vertical-scroll-list">
    <NumberComponent
      v-for="(element, index) in numbers"
      :index="index"
      :number="element"
    />
  </ul>
</template>
<style>
.vertical-scroll-list {
  display: block;
  width: 60%;
  height: 300px;
  overflow: auto;
  padding-inline: 5rem;
}
</style>

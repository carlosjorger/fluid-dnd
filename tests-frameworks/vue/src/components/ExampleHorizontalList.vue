<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";

const numbers = ref([1, 2, 3, 4, 5, 6]);
const [ parent ] = useDragAndDrop<number>(numbers as any, {
  direction: "horizontal",
});

const { id } = defineProps<{
  id: string;
}>();
</script>
<template>
  <div ref="parent" :id="id" class="list">
    <div
      v-for="(element, index) in numbers"
      :index="index"
      :id="'horizontal-child-' + +element.toString()"
      class="number"
    >
      {{ element }}
      <div style="display: flex; flex-direction: row">
        <span v-for="number in [...Array(4).keys()]">
          {{ number + element }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list {
  display: flex;
  padding: 10px;
  flex-direction: row;
}
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
}
</style>

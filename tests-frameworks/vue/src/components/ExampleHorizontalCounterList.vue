<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
const numbers = ref([1]);
const currentNumber = ref(numbers.value.length);
const { id } = defineProps<{
  id: string;
}>();
const [ parent ] = useDragAndDrop<number>(numbers as any, {
  handlerSelector: ".number",
  direction:'horizontal'
});
</script>
<template>
  <div class="counter-list">
    <div ref="parent" :id="id" class="vertical-list">
      <div
        v-for="(element, index) in numbers"
        :index="index"
        :id="'child-counter-' + +element.toString()"
        class="number"
      >
        <div class="inner-number">
          {{ element }}
        </div>
      </div>
    </div>
    <button
      v-on:click="
        () => {
          numbers.push(++currentNumber);
        }
      "
    >
      Add number
    </button>
  </div>
</template>
<style scoped>
.vertical-list {
  display: flex;
  padding-inline: 10px;
  flex-direction: row;
  gap: 5px
}
.number {
  padding: 15px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  background-color: pink;
}
.inner-number {
  background-color: aqua;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
const numbers = ref([1, 2, 3]);
const currentNumber = ref(numbers.value.length);
const { id } = defineProps<{
  id: string;
}>();
const [ parent ] = useDragAndDrop<number>(numbers as any, {
  handlerSelector: ".number",
});
</script>
<template>
  <div class="counter-list">
    <ul ref="parent" :id="id" class="vertical-list">
      <li
        v-for="(element, index) in numbers"
        :index="index"
        :id="'child-counter-' + +element.toString()"
        class="number"
      >
        <div class="inner-number">
          {{ element }}
        </div>
      </li>
    </ul>
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
.counter-list {
  display: flex;
  flex-direction: column;
}
.vertical-list {
  display: block;
  padding-inline: 10px;
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

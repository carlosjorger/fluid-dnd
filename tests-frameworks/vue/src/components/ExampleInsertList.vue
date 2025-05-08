<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
const numbers = ref([] as number[]);
const numberToInsert = ref(0);
const index = ref(0);
const { id } = defineProps<{
  id: string;
}>();
const [ parent, insertAt ] = useDragAndDrop<number>(numbers as any, {
  handlerSelector: ".number",
  delayBeforeInsert: 200
});
function insert(index:number){
  insertAt(index, numberToInsert.value)
  numberToInsert.value = Math.max(...numbers.value, numberToInsert.value) + 1
}
</script>
<template>
  <div class="counter-list">
    <ul ref="parent" :id="id" class="vertical-list">
        <li
          v-for="(element, index) in numbers"
          :index="index"
          :id="'child-counter-' + +element.toString()"
          :key="element"
          class="number"
        >
          <div class="inner-number">
            {{ element }}
          </div>
        </li>
    </ul>
    <div class="insert-menu">
      <label for="number-to-insert">Number to insert<input type="number" v-model="numberToInsert"></label>
      <label for="index">Index<input type="number" v-model="index" :min="0" :max="numbers.length"></label> 

      <button
        v-on:click="
          insert(index)
        "
      >
        Add number
      </button>
    </div>
  </div>
</template>
<style scoped>
.counter-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
}
.vertical-list {
  display: block;
  padding-inline: 10px;
  background-color: bisque;
  min-height: 100px;
}
.number {
  padding: 15px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
  width: 100px;
  background-color: pink;
  transition: opacity 200ms ease;
}
.number.from-inserting{
  opacity: 0;
}
.inner-number {
  background-color: aqua;
}
.insert-menu{
  display: flex;
  gap: 8px;
  width: 100%;
}
</style>

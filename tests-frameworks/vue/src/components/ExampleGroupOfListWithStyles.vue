<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
const listWithMixedStyles = ref([
  {
    number: 3,
    style:
      "color: white; background-color: green; padding: 26px 0; margin-top: 26px; margin-bottom: 40px; ,margin-left: 0px;",
  },
  {
    number: 5,
    style:
      "color: white; background-color: crimson; padding: 26px 0; margin: 14px 0; margin-right: 100px;",
  },
  {
    number: 1,
    style:
      "color: white; background-color: red; padding: 10px 0; margin: 23px;",
  },

  {
    number: 4,
    style:
      "color: white; background-color: wheat; padding: 30px 0; margin: 20px 0; margin-right: 100px; width:40%",
  },
  {
    number: 2,
    style:
      "color: white; background-color: blue; padding: 20px 0; margin: 12px; margin-right: 120px;  margin-left: 80px;",
  },
]);
defineProps<{
  id: string;
}>();
const [ parent1 ] = useDragAndDrop<number>(listWithMixedStyles as any, {
  droppableGroup: "groupWithStyles",
});
const listWithMixedStylesAndGaps = ref([
  {
    number: 4,
    style:
      "color: white; background-color: brown; padding: 26px 0; margin-bottom: 100px; margin-top:100px",
  },
  {
    number: 1,
    style:
      "color: white; background-color: red; padding: 20px 0; margin: 23px 0;",
  },
  {
    number: 2,
    style:
      "color: white; background-color: blue; padding: 20px 0; margin: 12px; margin-right: 120px;",
    class: "not-draggable",
  },
  {
    number: 3,
    style:
      "color: white; background-color: green; padding: 26px 0; margin: 26px; margin-left: 100px;",
  },
  {
    number: 5,
    style:
      "color: white; background-color: blue; padding: 20px 0; margin: 12px; margin-right: 120px;",
  },
]);
const [ parent2 ] = useDragAndDrop<number>(
  listWithMixedStylesAndGaps as any,
  {
    isDraggable: (el) => {
      return !el.classList.contains("not-draggable");
    },
    droppableGroup: "groupWithStyles",
  }
);
</script>
<template>
  <div class="example-cols">
    <div ref="parent1" class="vertical-list-with-mixed-styles">
      <div
        v-for="(element, index) in listWithMixedStyles"
        :index="index"
        :style="element.style"
      >
        {{ element.number }}
      </div>
    </div>
    <div ref="parent2" class="vertical-list-with-mixed-styles">
      <div
        v-for="(element, index) in listWithMixedStylesAndGaps"
        :index="index"
        :style="element.style"
        :class="element.class"
        :key="element.number"
      >
        {{ element.number }}
      </div>
    </div>
  </div>
</template>
<style>
.example-cols {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
.vertical-list-with-mixed-styles {
  width: 40%;
  background-color: darkgray;
  display: block;
}
.not-draggable {
  background-color: gray !important;
}
</style>

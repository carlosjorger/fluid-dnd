<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";

type Item = {
  id: string;
  value: string;
  is_visible: boolean;
};
type MinifiedItem = {
  id: string;
  label: string;
};
const list = ref([
  { id: "1", value: "Carcu", is_visible: true },
  { id: "2", value: "Rodri", is_visible: true },
  { id: "3", value: "Mbappe", is_visible: true },
]);
const MapItemToMinifiedItem = (item:Item) => {
  return {
      id: item.id,
      label: item.value,
    }  
}
const MapMinifiedItemToItem = (item:MinifiedItem) => {
  return {
      id: item.id,
      value: item.label,
      is_visible: true,
  }  
}
const [ parent1 ] = useDragAndDrop<Item>(list, {
  droppableGroup: "group1",
  mapFrom : (item:Item) => {
    return MapItemToMinifiedItem(item)
  },
});

const list2 = ref([
  { id: "11", label: "Cholo" },
  { id: "ab", label: "Popi" },
]);
const [ parent2 ] = useDragAndDrop<MinifiedItem>(list2, { 
  droppableGroup: "group1",
  mapFrom : (item:MinifiedItem) => {
    return MapMinifiedItemToItem(item)
  },
});
</script>
<template>
  <div class="flex gap-2 bg-[var(--sl-color-gray-6)]">
    <ul ref="parent1" class="block h-60 overflow-y-auto p-4 bg-[var(--sl-color-gray-5)]">
      <li class="number" v-for="(element, index) in list" :index="index" :key="element.id">
        {{ element.value }} - {{ element.is_visible }}
      </li>

    </ul>
    <ul ref="parent2" class="block h-60 overflow-y-auto p-4 bg-[var(--sl-color-gray-5)] mt-0 vertical-list">
      <li class="number" v-for="(element, index) in list2" :index="index" :key="element.id">
          {{ element.label }}
      </li>
    </ul>
  </div>
</template>
<style scoped>
.number {
  border-style: solid;
  padding-left: 10px;
  padding-block: 5px;
  margin-top: 0.25rem !important;
  border-width: 2px;
  border-color: var(--sl-color-gray-1);
  color: var(--sl-color-gray-2);
  min-width: 120px;
  width: 120px;
}

.temp-child {
  margin-top: 0 !important;
}
.vertical-list{
  margin-top: 0 !important;
}
</style>

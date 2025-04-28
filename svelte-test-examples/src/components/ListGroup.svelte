<script lang="ts">
import useDragAndDrop from "../../../src/svelte/useDragAndDrop";
type Item = {
  id: string;
  value: string;
  is_visible: boolean;
};
type MinifiedItem = {
  id: string;
  label: string;
};
const list = $state([
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
      is_visible: false,
  }  
}
const [ parent1 ] = useDragAndDrop<Item>(list, {
  droppableGroup: "group1",
  mapFrom : (item:Item) => {
    return MapItemToMinifiedItem(item)
  },
  onDragStart: (data) => {
    console.log('onDragStart', data)
  },
  onDragEnd: (data) => { 
    console.log('onDragEnd', data)
  },
});

const list2 = $state([
  { id: "11", label: "Cholo" },
  { id: "ab", label: "Popi" },
]);
const [ parent2 ] = useDragAndDrop<MinifiedItem>(list2, { 
  droppableGroup: "group1",
  mapFrom : (item:MinifiedItem) => {
    return MapMinifiedItemToItem(item)
  },
  onDragStart: (data) => {
    console.log('onDragStart', data)
  },
  onDragEnd: (data) => { 
    console.log('onDragEnd', data)
  },
});
</script>

<div class="flex gap-2 bg-[var(--sl-color-gray-6)]">
  <ul use:parent1 class="number-list">
    {#each list as  element, index (element.id) }
      <li class="number" data-index={index}>
        { element.value } {element.is_visible}
      </li>
    {/each}

  </ul>
  <ul use:parent2 class="number-list">
    {#each list2 as  element, index (element.id) }
      <li class="number" data-index={index}>
        { element.label }
      </li>
    {/each}

  </ul>
</div>

<style>
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

.number-list {
  display: block;
  height: 290px;
  overflow-y: auto;
  background-color: var(--sl-color-gray-5);
  padding: 1.5rem;
}
:global(.temp-child) {
  margin-top: 0 !important;
}
</style>

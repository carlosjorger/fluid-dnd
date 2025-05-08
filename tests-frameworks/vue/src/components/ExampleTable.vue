<script setup lang="ts">
import { ref } from "vue";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop";
type Person = {
  name: string;
  age: number;
  alias: string;
};
const table = ref<Person[]>([
  { name: "Carlos", age: 26, alias: "Carli" },
  { name: "Jorgito", age: 34, alias: "Pipo" },
  { name: "Ivis", age: 68, alias: "Mamá" },
]);
const [ parent ] = useDragAndDrop<Person>(table, {
  draggingClass: "drag-row",
});
</script>
<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Alias</th>
      </tr>
    </thead>
    <tbody ref="parent">
      <tr v-for="(person, index) in table" :index="index" :key="person.name">
        <td>{{ person.name }}</td>
        <td>{{ person.age }}</td>
        <td>{{ person.alias }}</td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
table {
  width: 400px;
  border-collapse: collapse;
  background-color: pink;
}
.dragging {
  display: table;
}
table tbody tr {
  display: table-row;
  background-color: red;
  transition: background-color 200ms ease;
}
table tbody tr td {
  width: 80px;
}
.drag-row {
  display: table;
  background-color: aqua;
  transition: background-color 200ms ease;
}
</style>

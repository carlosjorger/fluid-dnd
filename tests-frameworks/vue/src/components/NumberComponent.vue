<script setup lang="ts">
const { number } = defineProps<{
  number: number;
}>();
</script>
<template>
  <li class="number">
    {{ number }}
  </li>
</template>
<style>
.number {
  padding-left: 5px;
  text-align: start;
  border-style: solid;
  border-width: 0.8rem;
}
</style>

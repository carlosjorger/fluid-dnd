<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";

const list = ref([...Array(20).keys()]);
const [parent] = useDragAndDrop(list);
</script>
<template>
	<ul ref="parent" class="number-list">
		<li class="number" v-for="(element, index) in list" :index="index">
			{{ element }}
		</li>
	</ul>
</template>

<style>
.number {
	border-style: solid;
	margin-top: 0.25rem;
	border-width: 2px;
	border-color: var(--sl-color-gray-1);
}
.number-list {
	display: block;
	padding-inline: 10px;
	overflow-y: auto;
	width: 80%;
	height: 300px;
	padding-left: 30px;
}
.temp-child {
	margin-top: 0 !important;
}
</style>

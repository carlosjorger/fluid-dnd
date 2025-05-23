<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import { type Coordinate } from "fluid-dnd";

const props = defineProps({
	lockAxis: {
		type: Boolean,
		default: false
	},
	gridTranslate: {
		type: Boolean,
		default: false
	}
});
const mappers = [
	(coordinate: Coordinate) => {
		return coordinate;
	}
];
const lockAxis = (coordinate: Coordinate) => {
		return {
			x: 0,
			y: coordinate.y
		};
	};
if (props.lockAxis) {
	mappers.push(lockAxis);
}
if (props.gridTranslate) {
	mappers.push(({ x, y }: Coordinate) => {
		const gridSize = 25.78;
		return {
			x: Math.ceil(x / gridSize) * gridSize,
			y: Math.ceil(y / gridSize) * gridSize
		};
	});
}
const list = ref([...Array(20).keys()]);
const [parent] = useDragAndDrop(list, {
	draggingClass: "dragging",
	coordinateTransform: mappers
});
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
	padding-left: 12px;
	padding-block: 8px;
}
.number-list {
	display: block;
	padding-inline: 8px;
	overflow-y: auto;
	width: 80%;
	height: 257px;
	padding-left: 30px;
}
.temp-child {
	margin-top: 0 !important;
}
.dragging {
	transition:
		background-color color 150ms ease-in,
		color 150ms ease-in;
	background-color: var(--sl-color-gray-1);
	color: black;
}
</style>

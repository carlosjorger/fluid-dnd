<script setup lang="ts">
import { ref } from 'vue';
import useDragAndDrop from '../../../../src/vue/useDragAndDrop';

const lsitWithMixedStyles = ref([
	{
		number: 1,
		style: 'color: white; background-color: red; width: 50px;'
	},
	{
		number: 2,
		style: 'color: white; background-color: blue; padding: 30px;'
	},
	{
		number: 3,
		style: 'color: white; background-color: blueviolet; padding: 10px; height: 70px;'
	},
	{
		number: 4,
		style: 'color: white; background-color: chocolate; padding: 10px; width: 15px;'
	}
]);
defineProps<{
	id: string;
}>();

const [parent] = useDragAndDrop<number>(lsitWithMixedStyles as any, {
	direction: 'horizontal'
});
</script>
<template>
	<div
		ref="parent"
		id="example-vertical-list-with-child-elements"
		class="horizontal-list-with-mixed-styles"
	>
		<div v-for="(element, index) in lsitWithMixedStyles" :index="index" :style="element.style">
			{{ element.number }}
		</div>
	</div>
</template>
<style scoped>
.horizontal-list-with-mixed-styles {
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
	overflow: auto;
	background-color: darkgrey;
	border: solid;
	padding: 2rem;
}
.number {
	padding-left: 5px;
	text-align: start;
	border-style: solid;
	border-width: 0.8rem;
	width: 100px;
}
</style>

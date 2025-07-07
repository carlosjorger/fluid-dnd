<script setup lang="ts">
import { ref } from 'vue';
import useDragAndDrop from '../../../../src/vue/useDragAndDrop';

const numbers1 = ref([1, 2, 3, 4, 5, 6]);
const [parent1] = useDragAndDrop<number>(numbers1 as any, {
	direction: 'vertical',
	droppableGroup: 'group1'
});

const numbers2 = ref([7, 8, 9, 10, 11, 12, 13, 14, 15]);
const [parent2] = useDragAndDrop<number>(numbers2 as any, {
	direction: 'vertical',
	droppableGroup: 'group1'
});

const numbers3 = ref([16, 17, 18, 19, 20, 21]);
const [parent3] = useDragAndDrop<number>(numbers3 as any, {
	direction: 'horizontal',
	droppableGroup: 'group1'
});

const numbers4 = ref([22, 23, 24, 25, 26, 27]);
const [parent41] = useDragAndDrop<number>(numbers4 as any, {
	direction: 'horizontal',
	droppableGroup: 'group1'
});

const list = ref([1, 2, 3, 4]);
const [parent4] = useDragAndDrop<number>(list as any, {
	droppableGroup: 'group2 group3'
});

const list2 = ref([5, 6, 7, 8]);
const [parent5] = useDragAndDrop<number>(list2 as any, {
	droppableGroup: 'group2',
	direction: 'horizontal'
});
const { id } = defineProps<{
	id: string;
}>();
</script>
<template>
	<div :id="id" class="group">
		<div ref="parent1" class="vertical-list">
			<div
				v-for="(element, index) in numbers1"
				:index="index"
				:id="'group-child-' + +element.toString()"
				class="number"
				:key="element"
			>
				{{ element }}
			</div>
		</div>
		<ul ref="parent2" class="scrolled-list">
			<li
				v-for="(element, index) in numbers2"
				:index="index"
				:id="'group-child-' + +element.toString()"
				class="number"
				:key="element"
			>
				{{ element }}
			</li>
		</ul>
		<div ref="parent3" class="horizontal-list">
			<div
				v-for="(element, index) in numbers3"
				:index="index"
				:id="'group-child-' + +element.toString()"
				class="number"
				:key="element"
			>
				{{ element }}
			</div>
		</div>
	</div>
	<div ref="parent41" class="horizontal-list">
		<div
			v-for="(element, index) in numbers4"
			:index="index"
			:id="'group-child-' + +element.toString()"
			class="number"
			:key="element"
		>
			{{ element }}
		</div>
	</div>
	<ul ref="parent4" class="number-list p-8">
		<li class="number nested" v-for="(element, index) in list" :index="index" :key="element">
			<span v-for="number in [...Array(4).keys()]">
				{{ number + element }}
			</span>
		</li>
	</ul>
	<ul ref="parent5" class="number-list-h">
		<li class="number nested" v-for="(element, index) in list2" :index="index" :key="element">
			<span v-for="number in [...Array(4).keys()]">
				{{ number + element }}
			</span>
		</li>
	</ul>
</template>
<style scoped>
.group {
	display: grid;
	grid-template-areas:
		'vertical scrolled'
		'horizontal  horizontal';
	gap: 10%;
	margin-bottom: 15%;
}
.vertical-list {
	background-color: aliceblue;
	height: 400px;
	grid-area: vertical;
	margin-top: 1rem;
	padding-top: 3rem;
}
.scrolled-list {
	padding-block: 20px;
	background-color: aliceblue;
	height: 420px;
	overflow: auto;
	display: block;
	padding-inline: 25px;
	grid-area: scrolled;
}
.horizontal-list {
	display: flex;
	padding: 10px;
	flex-direction: row;
	background-color: pink;
	padding: 40px;
	grid-area: horizontal;
	overflow: auto;
	max-width: 600px;
	height: 150px;
}
.number {
	padding-left: 5px;
	text-align: start;
	border-style: solid;
	border-width: 0.8rem;
	min-width: 100px;
	max-width: 100px;
}
.number.nested {
	display: flex;
	flex-direction: row;
	gap: 0.4rem;
	align-items: center;
}
.number-list {
	display: block;
	padding-inline: 25px;
}
.number-list-h {
	display: flex;
	padding-inline: 25px;
}
</style>

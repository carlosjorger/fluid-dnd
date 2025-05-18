<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "./PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";
import touchDelaySilder from "./touchDelaySilder.vue";

const pokemons = ref([] as Pokemon[]);
pokemons.value = await fetchPokemons(3);
const delay = ref(150);
let parent = ref<HTMLElement | undefined>();

watchEffect(() => {
	const dragAndDrop = useDragAndDrop(pokemons, {
		draggingClass: "dragging-pokemon",
		delayBeforeTouchMoveEvent: delay.value
	});
	parent = dragAndDrop[0];
});
function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
</script>
<template>
	<div class="flex-col gap-4">
		<div class="flex max-sm:justify-center items-start">
			<div
				ref="parent"
				class="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
			>
				<PokemonComponent
					v-for="(pokemon, index) in pokemons"
					:key="pokemon.name"
					:index="index"
					:pokemon="pokemon"
				/>
			</div>
		</div>
		<touchDelaySilder v-if="isMobileDevice()" v-model="delay" />
	</div>
</template>
<style>
.sl-markdown-content
	:not(a, strong, em, del, span, input, code)
	+ :not(a, strong, em, del, span, input, code, :where(.not-content *)) {
	margin-top: 0rem !important;
}
</style>

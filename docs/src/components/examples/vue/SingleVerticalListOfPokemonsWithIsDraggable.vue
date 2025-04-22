<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/vue/PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = ref([] as Pokemon[]);
pokemons.value = await fetchPokemons(9);
const sizes = {
  100: "S",
  250: "M",
  1200: "L",
};
const getSize = (weight: number) => {
  for (const sizeLimit of Object.keys(sizes)) {
    const limit = parseFloat(sizeLimit) as keyof typeof sizes;
    if (weight < limit) {
      return sizes[limit];
    }
  }
};
const [ parent ] = useDragAndDrop(pokemons, {
  isDraggable: (el) => !el.classList.contains("is-not-draggable"),
  draggingClass: "dragging-pokemon",
});
</script>
<template>
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
        :class="{
          'is-not-draggable': getSize(pokemon.weight) === 'L',
        }"
      />
    </div>
  </div>
</template>
<style>
.sl-markdown-content
  :not(a, strong, em, del, span, input, code)
  + :not(a, strong, em, del, span, input, code, :where(.not-content *)) {
  margin-top: 0rem !important;
}
.is-not-draggable {
  background-color: gray !important;
}
</style>

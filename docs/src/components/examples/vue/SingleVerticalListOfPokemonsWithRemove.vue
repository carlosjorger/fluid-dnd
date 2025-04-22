<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/vue/PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = ref([] as Pokemon[]);
pokemons.value = await fetchPokemons(9);
const [ parent,_, removeEvent ] = useDragAndDrop(pokemons, {
  removingClass: "removed",
  delayBeforeRemove: 300,
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
        has-remove
        :removeEvent
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
</style>

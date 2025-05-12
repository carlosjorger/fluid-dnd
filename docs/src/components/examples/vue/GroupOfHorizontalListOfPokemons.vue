<script setup lang="ts">
import { ref } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/vue/PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = ref([] as Pokemon[]);
pokemons.value = await fetchPokemons(9);

const pokemon2G = ref([] as Pokemon[]);
pokemon2G.value = await fetchPokemons(9, 151);

const pokemon3G = ref([] as Pokemon[]);
pokemon3G.value = await fetchPokemons(9, 251);

const [ parent ] = useDragAndDrop(pokemons, {
  droppableGroup: "group",
  direction: "horizontal",
  draggingClass: "dragging-pokemon",
  droppableClass:'hover'
});
const [ parent2 ] = useDragAndDrop(pokemon2G, {
  droppableGroup: "group",
  direction: "horizontal",
  draggingClass: "dragging-pokemon",
  droppableClass:'hover'
});

const [ parent3 ] = useDragAndDrop(pokemon3G, {
  droppableGroup: "group",
  direction: "horizontal",
  draggingClass: "dragging-pokemon",
  droppableClass:'hover'
});
</script>
<template>
  <div
    class="flex max-sm:justify-center flex-col gap-4 max-sm:gap-0.5 items-start"
  >
    <div
      ref="parent"
      class="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
    >
      <PokemonComponent
        class="min-w-44 max-sm:min-w-32"
        v-for="(pokemon, index) in pokemons"
        :key="pokemon.name"
        :index="index"
        :pokemon="pokemon"
      />
    </div>
    <div
      ref="parent2"
      class="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
    >
      <PokemonComponent
        class="min-w-44 max-sm:min-w-32"
        v-for="(pokemon, index) in pokemon2G"
        :key="pokemon.name"
        :index="index"
        :pokemon="pokemon"
      />
    </div>
    <div
      ref="parent3"
      class="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
    >
      <PokemonComponent
        class="min-w-44 max-sm:min-w-32"
        v-for="(pokemon, index) in pokemon3G"
        :key="pokemon.name"
        :index="index"
        :pokemon="pokemon"
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
.pokemon-generation{
  transition: background-color 150ms ease-in;
}
.pokemon-generation.hover{
  background-color: rgb(236 238 242 / 0.8) !important;
}
</style>

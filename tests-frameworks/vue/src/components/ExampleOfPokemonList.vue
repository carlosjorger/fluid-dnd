<script setup lang="ts">
import { onMounted, ref } from "vue";
import PokemonComponent from "./PokemonComponent.vue";

import { fetchPokemons } from "../../../../docs/src/server/pokemonServer.ts";
import type { Pokemon } from "../../../../docs/src/components/examples/Pokemon.ts";
import useDragAndDrop from "../../../../src/vue/useDragAndDrop.ts";

const pokemons = ref([] as Pokemon[]);

onMounted(async () => {
  pokemons.value = await fetchPokemons(9);
});
const handlerSelector = ".pokemon-handler";
const [ parent,_, removeEvent ] = useDragAndDrop(pokemons as any, {
  handlerSelector,
  delayBeforeRemove: 300,
});

defineProps<{
  id: string;
}>();
</script>

<template>
  <div ref="parent" class="pokemon-list">
    <PokemonComponent
      v-for="(pokemon, index) in pokemons"
      :index="index"
      :pokemon="pokemon"
      :key="pokemon.name"
      handlerSelector="pokemon-handler"
      :removeEvent
      has-remove
    />
  </div>
</template>
<style>
.pokemon-list {
  width: 40%;
  background-color: darkgray;
  display: block;
  overflow: auto;
  height: 600px;
}
.pokemon-handler {
  width: 0.625rem;
  display: block;
}
</style>

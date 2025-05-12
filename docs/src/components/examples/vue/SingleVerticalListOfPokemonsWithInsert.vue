<script setup lang="ts">
import { ref, watch } from "vue";
import { useDragAndDrop } from "fluid-dnd/vue";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/vue/PokemonComponent.vue";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = ref([] as Pokemon[]);
watch(pokemons,async()=>{
  pokemonsToSelected.value = await fetchPokemons(10,0, pokemons.value)
},{
  deep: true
})
pokemons.value = await fetchPokemons(3);
const [ parent, insertAt ] = useDragAndDrop(pokemons, {
  removingClass: "removed",
  delayBeforeRemove: 300,
  draggingClass: "dragging-pokemon",
});
const pokemonsToSelected = ref([] as Pokemon[]);
const pokemonToAdd = ref<Pokemon>()
function insertPokemon(){
  const lastPosition = pokemons.value.length
  if (pokemonToAdd.value) {
    insertAt(lastPosition, pokemonToAdd.value)
    pokemonToAdd.value = undefined
  }
}
</script>
<template>
  <div class="flex max-sm:justify-center items-start">
    <div class="flex flex-col gap-4">
      <div
        ref="parent"
        class="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
      >
        <PokemonComponent
          v-for="(pokemon, index) in pokemons"
          :key="pokemon.name"
          :index="index"
          :pokemon="pokemon"
          class="min-h-[200px]"
        />
      </div>
     <div class="flex gap-4 max-sm:flex-col">
      <select v-model="pokemonToAdd" class="rounded-lg bg-gray-700 p-2 w-60">
        <option disabled :value="null">Please select one</option>
        <option v-for="(pokemon, index) in pokemonsToSelected" :value="pokemon">{{pokemon.name}}</option>
      </select>
      <button class="rounded-lg border-2 hover:bg-gray-700 transition-colors" @click="insertPokemon">Add pokemon</button>
     </div>
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

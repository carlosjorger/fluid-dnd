<script setup lang="ts">
import type { Pokemon } from "../../../../docs/src/components/examples/Pokemon";
import Handler from "./icons/handler.vue";
import { computed } from "vue";
import Trash from "./icons/trash.vue";

const { pokemon, removeEvent, index } = defineProps<{
  pokemon: Pokemon;
  handlerSelector?: string;
  hasRemove: boolean;
  removeEvent?: (index: number) => void;
  index: number;
}>();
const remove = (index: number) => {};
const removeEventNotUndefined = computed(() => {
  return removeEvent ?? remove;
});

const pokeColor = {
  bulbasaur: "bg-[#64dbb2]",
  ivysaur: "bg-[#64dbb2]",
  venusaur: "bg-[#64dbb2]",
  charmander: "bg-[#f0776a]",
  charmeleon: "bg-[#f0776a]",
  charizard: "bg-[#f0776a]",
  squirtle: "bg-[#58abf6]",
  wartortle: "bg-[#58abf6]",
  blastoise: "bg-[#58abf6]",

  green: "#64dbb2",
  orange: "#f0776a",
  blue: "#58abf6",
  yellow: "#facd4b",
  purple: "#9f5bba",
  coco: "#ca8179",
} as const;
</script>

<template>
  <div :index :class="[pokeColor[pokemon.name]]">
    <div class="p-2">
      <div>
        <span v-if="handlerSelector">
          <Handler :class="[handlerSelector]"
        /></span>
        <div class="">{{ pokemon.name }}</div>
        <div>#{{ pokemon.order }}</div>
      </div>
      <img :src="pokemon.sprites.front_default" alt="pokemon" />
    </div>
    <div>
      <div v-for="pokemonType in pokemon.types">
        {{ pokemonType.type.name }}
      </div>
    </div>
    <div class="px-1 mx-2 py-1 remove" v-if="hasRemove">
      <Trash color="red" @click="removeEventNotUndefined(index)" />
    </div>
  </div>
</template>
<style>
.pokemon {
  margin-top: 0rem !important;
  background-image: url("../../assets/pokemon-bg.svg");
}
.remove {
  cursor: pointer;
}
</style>

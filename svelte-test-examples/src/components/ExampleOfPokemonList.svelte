<script lang="ts">
import { onMounted, ref } from "vue";
import PokemonComponent from "./PokemonComponent.svelte";

import { fetchPokemons } from "../../../docs/src/server/pokemonServer.ts";
import type { Pokemon } from "../../../docs/src/components/examples/Pokemon.ts";
import useDragAndDrop from "../../../src/svelte/useDragAndDrop.ts";

const pokemons = $state([] as Pokemon[]);
fetchPokemons(9).then((newPokemons) => {
  pokemons.push(...newPokemons);
});
// const handlerSelector = ".pokemon-handler";
const [ parent,_, removeEvent ] = useDragAndDrop(pokemons as any, {
  // handlerSelector,
  delayBeforeRemove: 300,
});

</script>
<div use:parent class="pokemon-list">
  {#each pokemons as pokemon, index (pokemon.name)}
  <PokemonComponent
    index={index}
    pokemon={pokemon}
    handlerSelector="pokemon-handler"
  />
  {/each}
</div>
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

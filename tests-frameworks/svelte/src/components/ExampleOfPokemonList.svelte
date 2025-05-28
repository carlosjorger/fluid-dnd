<script lang="ts">
import PokemonComponent from "./PokemonComponent.svelte";

import { fetchPokemons } from "../../../../docs/src/server/pokemonServer.ts";
import type { Pokemon } from "../../../../docs/src/components/examples/Pokemon.ts";
import useDragAndDrop from "../../../../src/svelte/useDragAndDrop.ts";

const pokemons = $state([] as Pokemon[]);
fetchPokemons(9).then((newPokemons) => {
  pokemons.push(...newPokemons);
});
const pokemons2 = $state([] as Pokemon[]); 
fetchPokemons(9, 151).then((newPokemons) => {
  pokemons2.push(...newPokemons);
});
const pokemons3 = $state([] as Pokemon[]); 
fetchPokemons(9, 252).then((newPokemons) => {
  pokemons3.push(...newPokemons);
});
// const handlerSelector = ".pokemon-handler";
const [ parent ] = useDragAndDrop(pokemons as any, {
  // handlerSelector,
  delayBeforeRemove: 300,
  droppableGroup: 'pokemon-group'

});
const [ parent2 ] = useDragAndDrop(pokemons2 as any, {
  // handlerSelector,
  delayBeforeRemove: 300,
  droppableGroup: 'pokemon-group'

});
const [ parent3 ] = useDragAndDrop(pokemons3 as any, {
  // handlerSelector,
  delayBeforeRemove: 300,
  droppableGroup: 'pokemon-group'

});
</script>
<div class="flex gap-2">
  <div use:parent class="pokemon-list">
    {#each pokemons as pokemon, index (pokemon.name)}
    <PokemonComponent
      index={index}
      pokemon={pokemon}
      handlerSelector="pokemon-handler"
    />
    {/each}
  </div>
  <div use:parent2 class="pokemon-list">
    {#each pokemons2 as pokemon, index (pokemon.name)}
    <PokemonComponent
      index={index}
      pokemon={pokemon}
      handlerSelector="pokemon-handler"
    />
    {/each}
  </div>
  <div use:parent3 class="pokemon-list">
    {#each pokemons3 as pokemon, index (pokemon.name)}
    <PokemonComponent
      index={index}
      pokemon={pokemon}
      handlerSelector="pokemon-handler"
    />
    {/each}
  </div>
</div>
<style>
.pokemon-list {
  width: 25%;
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

<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/svelte/PokemonComponent.svelte";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = $state([] as Pokemon[]);
fetchPokemons(9).then((newPokemons)=>{
  pokemons.push(...newPokemons);
});

const pokemon2G = $state([] as Pokemon[]);
fetchPokemons(9, 151).then((newPokemons)=>{
  pokemon2G.push(...newPokemons);
});

const pokemon3G = $state([] as Pokemon[]);
fetchPokemons(9, 251).then((newPokemons)=>{
  pokemon3G.push(...newPokemons);
});

const [ parent ] = useDragAndDrop(pokemons, {
  droppableGroup: "group",
  draggingClass: "dragging-pokemon",
  droppableClass:'hover'
});
const [ parent2 ] = useDragAndDrop(pokemon2G, {
  droppableGroup: "group",
  draggingClass: "dragging-pokemon",
  droppableClass:'hover'
});

const [ parent3 ] = useDragAndDrop(pokemon3G, {
  droppableGroup: "group",
  draggingClass: "dragging-pokemon",
  droppableClass:'hover'
});
</script>
<div class="flex max-sm:justify-center gap-4 max-sm:gap-0.5 items-start">
  <div
    use:parent
    class="pokemon-generation bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block overflow-auto max-h-[30rem] max-lg:p-1 max-sm:p-0.5 max-sm:border-2"
  >
    {#each pokemons as pokemon, index (pokemon.name)}
      <PokemonComponent
        index={index}
        pokemon={pokemon}
      />
      
    {/each}
  </div>
  <div
    use:parent2
    class="pokemon-generation bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block overflow-auto max-h-[30rem] max-lg:p-1 max-sm:p-0.5 max-sm:border-2"
  >
    {#each pokemon2G as pokemon, index (pokemon.name)}
      <PokemonComponent
        index={index}
        pokemon={pokemon}
      />
    {/each}
  </div>
  <div
    use:parent3
    class="pokemon-generation bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block overflow-auto max-h-[30rem] max-lg:p-1 max-sm:p-0.5 max-sm:border-2"
  >
    {#each pokemon3G as pokemon, index (pokemon.name)}
      <PokemonComponent
        index={index}
        pokemon={pokemon}
      />
    {/each}
  </div>
</div>
<style>
:global(.sl-markdown-content
  :not(a, strong, em, del, span, input, code)
  + :not(a, strong, em, del, span, input, code, :where(.not-content *))) {
  margin-top: 0rem !important;
}
.pokemon-generation{
  transition: background-color 150ms ease-in;
}
:global(.pokemon-generation.hover){
  background-color: rgb(236 238 242 / 0.8) !important;
}
</style>

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
  fetchPokemons(9, 151).then((newPokemons2G)=>{
    pokemon2G.push(...newPokemons2G);
  });

  const pokemon3G = $state([] as Pokemon[]);
  fetchPokemons(9, 251).then((newPokemons3G)=>{
    pokemon3G.push(...newPokemons3G);
  });

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
<div
  class="flex max-sm:justify-center flex-col gap-4 max-sm:gap-0.5 items-start"
>
  <div
    use:parent
    class="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
  >
  {#each pokemons as pokemon, index (pokemon.order)}
    <PokemonComponent
      class="min-w-44 max-sm:min-w-32"
      index={index}
      pokemon={pokemon}
    />
    
  {/each}
  </div>
  <div
    use:parent2
    class="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
  >
    {#each pokemon2G as pokemon, index (pokemon.order)}
      <PokemonComponent
        class="min-w-44 max-sm:min-w-32"
        index={index}
        pokemon={pokemon}
      />
    {/each}
  </div>
  <div
    use:parent3
    class="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
  >
    {#each pokemon3G as pokemon, index (pokemon.order)}
      <PokemonComponent
        class="min-w-44 max-sm:min-w-32"
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

<script lang="ts">
  import { useDragAndDrop } from "fluid-dnd/svelte";
  import type { Pokemon } from "../Pokemon";
  import PokemonComponent from "./PokemonComponent.svelte";
  import { fetchPokemons } from "@/server/pokemonServer";
  
  let pokemons = $state([] as Pokemon[]);
  fetchPokemons(3).then((newPokemons) => {
      pokemons.push(...newPokemons);
  });
  const [ parent ] = useDragAndDrop(pokemons, {
    draggingClass: "dragging-pokemon",
  });
</script>
<div class="flex max-sm:justify-center items-start">
  <div
    use:parent
    class="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
  >
  {#each pokemons as pokemon, index (pokemon.name)}
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
</style>
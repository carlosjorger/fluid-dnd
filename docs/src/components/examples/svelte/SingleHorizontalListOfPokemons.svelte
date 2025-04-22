<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/svelte/PokemonComponent.svelte";
import { fetchPokemons } from "@/server/pokemonServer";

let pokemons = $state([] as Pokemon[]);
fetchPokemons(3).then((newPokemons) => {
    pokemons.push(...newPokemons);
});
const [ parent ] = useDragAndDrop(pokemons, {
  direction: "horizontal",
  draggingClass: "dragging-pokemon",
});
</script>
<div class="flex max-sm:justify-center items-start">
  <div
    use:parent
    class="bg-gray-200/60 border-solid border-black/40 rounded-2xl border-4 p-4 max-sm:p-2 flex flex-row overflow-auto gap-2 max-sm:gap-1"
    
  >
  {#each pokemons as pokemon, index (pokemon.name)}
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
</style>

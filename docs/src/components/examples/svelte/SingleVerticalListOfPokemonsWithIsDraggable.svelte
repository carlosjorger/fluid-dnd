<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/svelte/PokemonComponent.svelte";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = $state([] as Pokemon[]);
fetchPokemons(9).then((newPokemons) => {
  pokemons.push(...newPokemons);
});
const sizes = {
  100: "S",
  250: "M",
  1200: "L",
};
const getSize = (weight: number) => {
  for (const sizeLimit of Object.keys(sizes)) {
    const limit = parseFloat(sizeLimit) as keyof typeof sizes;
    if (weight < limit) {
      return sizes[limit];
    }
  }
};
const [ parent ] = useDragAndDrop(pokemons, {
  isDraggable: (el) => !el.classList.contains("is-not-draggable"),
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
        class={getSize(pokemon.weight) === 'L'?'is-not-draggable':''} 
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
:global(.is-not-draggable) {
  background-color: gray !important;
}
</style>

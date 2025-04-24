<script lang="ts">
import { useDragAndDrop } from "fluid-dnd/svelte";
import type { Pokemon } from "../Pokemon";
import PokemonComponent from "@/components/examples/svelte/PokemonComponent.svelte";
import { fetchPokemons } from "@/server/pokemonServer";

const pokemons = $state([] as Pokemon[]);
fetchPokemons(3).then((newPokemons)=>{
  pokemons.push(...newPokemons);
});
const [ parent, insertAt ] = useDragAndDrop(pokemons, {
  removingClass: "removed",
  delayBeforeRemove: 300,
});
let pokemonsToSelected = $state([] as Pokemon[]);
$effect(()=>{
  (async () => {
    pokemonsToSelected = await fetchPokemons(10,0, pokemons)
  })()
})
let pokemonToAdd = $state<Pokemon|undefined>(undefined)
function insertPokemon(){
  const lastPosition = pokemons.length
  if (pokemonToAdd) {
    insertAt(lastPosition, pokemonToAdd)
    pokemonToAdd = undefined
  }
}
</script>
<div class="flex max-sm:justify-center items-start">
  <div class="flex flex-col gap-4">
    <div
      use:parent
      class="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
    >
      {#each pokemons as pokemon, index (pokemon.name)}
        <PokemonComponent
          index={index}
          pokemon={pokemon}
          class="min-h-[200px]"
        />
      {/each}
    </div>
   <div class="flex gap-4 max-sm:flex-col">
    <select bind:value={pokemonToAdd} class="rounded-lg bg-gray-700 p-2 w-60">
      <option disabled value={null}>Please select one</option>
      {#each pokemonsToSelected as pokemon (pokemon.name)}
        <option value={pokemon}>{pokemon.name}</option>
      {/each}
    </select>
    <button class="rounded-lg border-2 hover:bg-gray-700 transition-colors" onclick={insertPokemon}>Add pokemon</button>
   </div>
  </div>
</div>
<style>
:global(.sl-markdown-content
  :not(a, strong, em, del, span, input, code)
  + :not(a, strong, em, del, span, input, code, :where(.not-content *))) {
  margin-top: 0rem !important;
}
</style>

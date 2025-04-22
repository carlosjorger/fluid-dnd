<script lang="ts">
import type { Pokemon } from "../../../docs/src/components/examples/Pokemon";

type Props = {
  pokemon: Pokemon;
  handlerSelector?: string;
  // hasRemove?: boolean;
  removeEvent?: (index: number) => void;
  index: number;
  }
const { pokemon, handlerSelector, removeEvent, index }:Props = $props();
const remove = (index: number) => {};
// const removeEventNotUndefined = $derived(removeEvent ?? remove)

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
<div data-index={index} class={pokeColor[pokemon.name]}>
  <div class="p-2">
    <div>
      <div class="">{ pokemon.name }</div>
      <div>#{ pokemon.order }</div>
    </div>
    <img src={pokemon.sprites.front_default} alt="pokemon" />
  </div>
  <div>
    {#each pokemon.types as pokemonType}
      <div>
        { pokemonType.type.name }
      </div>
      
    {/each}
  </div>
  <!-- <div class="px-1 mx-2 py-1 remove" v-if="hasRemove">
    <Trash color="red" @click="removeEventNotUndefined(index)" />
  </div> -->
</div>
<style>
.pokemon {
  margin-top: 0rem !important;
  background-image: url("../../assets/pokemon-bg.svg");
}
.remove {
  cursor: pointer;
}
</style>

<script lang="ts">
  import { useDragAndDrop } from "fluid-dnd/svelte";
  import type { Pokemon } from "../Pokemon";
  import PokemonComponent from "./PokemonComponent.svelte";
  import { fetchPokemons } from "@/server/pokemonServer";
  import TouchDelaySilder from "./touchDelaySilder.svelte";

  let delay = $state(150);
  let pokemons = $state([] as Pokemon[]);
  let parent: HTMLElement;
  fetchPokemons(3).then((newPokemons) => {
      pokemons.push(...newPokemons);
  });
  const changeDelay = (newDelay:number) => {
    delay = newDelay;
    if (parent) {
      dragAndDropAction(parent);
    }
  }
  const [ dragAndDropAction ] = $derived(useDragAndDrop(pokemons, {
      draggingClass: "dragging-pokemon",
      delayBeforeTouchMoveEvent: delay
    }));
 function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
</script>
	<div class="flex-col gap-4">
    <div class="flex max-sm:justify-center items-start">
      <div
        bind:this={parent}
        use:dragAndDropAction
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
    {#if isMobileDevice()}
      <TouchDelaySilder {changeDelay} />
    {/if}
</div>

<style>
  :global(.sl-markdown-content
    :not(a, strong, em, del, span, input, code)
    + :not(a, strong, em, del, span, input, code, :where(.not-content *))) {
    margin-top: 0rem !important;
  }
</style>
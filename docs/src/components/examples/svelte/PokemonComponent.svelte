<script lang="ts">
    import type { Pokemon } from "../Pokemon";
    import Trash from "../../icons/svelte/trash.svelte";
    import Handler from "../../icons/svelte/handler.svelte";
    
    type Props = {
        pokemon: Pokemon;
        handlerClass?: string;
        hasRemove?: boolean;
        index: number;
        class?: string;
        removeEvent?: (index: number) => void
    }
    const props: Props = $props();
    const { pokemon, handlerClass, hasRemove, index, removeEvent } = props;
    const remove = (index: number) => {};
    const removeEventNotUndefined = $derived(removeEvent ?? remove)
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

        chikorita: "bg-[#64dbb2]",
        bayleef: "bg-[#64dbb2]",
        meganium: "bg-[#64dbb2]",
        cyndaquil: "bg-[#f0776a]",
        quilava: "bg-[#f0776a]",
        typhlosion: "bg-[#f0776a]",
        totodile: "bg-[#6BB5E7]",
        croconaw: "bg-[#6BB5E7]",
        feraligatr: "bg-[#6BB5E7]",

        treecko: "bg-[#64dbb2]",
        grovyle: "bg-[#64dbb2]",
        sceptile: "bg-[#64dbb2]",
        torchic: "bg-[#f0776a]",
        combusken: "bg-[#f0776a]",
        blaziken: "bg-[#f0776a]",
        mudkip: "bg-[#58abf6]",
        marshtomp: "bg-[#58abf6]",
        swampert: "bg-[#58abf6]",

        green: "#64dbb2",
        orange: "#f0776a",
        blue: "#58abf6",
        yellow: "#facd4b",
        purple: "#9f5bba",
        coco: "#ca8179",
    } as const;

    const darkPokeColor = {
        bulbasaur: "dark:bg-[#429075]",
        ivysaur: "dark:bg-[#429075]",
        venusaur: "dark:bg-[#429075]",
        charmander: "dark:bg-[#8e463f]",
        charmeleon: "dark:bg-[#8e463f]",
        charizard: "dark:bg-[#8e463f]",
        squirtle: "dark:bg-[#3a72a4]",
        wartortle: "dark:bg-[#3a72a4]",
        blastoise: "dark:bg-[#3a72a4]",

        chikorita: "dark:bg-[#429075]",
        bayleef: "dark:bg-[#429075]",
        meganium: "dark:bg-[#429075]",
        cyndaquil: "dark:bg-[#8e463f]",
        quilava: "dark:bg-[#8e463f]",
        typhlosion: "dark:bg-[#8e463f]",
        totodile: "dark:bg-[#3a72a4]",
        croconaw: "dark:bg-[#3a72a4]",
        feraligatr: "dark:bg-[#3a72a4]",

        treecko: "dark:bg-[#429075]",
        grovyle: "dark:bg-[#429075]",
        sceptile: "dark:bg-[#429075]",
        torchic: "dark:bg-[#8e463f]",
        combusken: "dark:bg-[#8e463f]",
        blaziken: "dark:bg-[#8e463f]",
        mudkip: "dark:bg-[#3a72a4]",
        marshtomp: "dark:bg-[#3a72a4]",
        swampert: "dark:bg-[#3a72a4]",

        green: "#64dbb2",
        orange: "#f0776a",
        blue: "#58abf6",
        yellow: "#facd4b",
        purple: "#9f5bba",
        coco: "#ca8179",
    } as const;
</script>
<div
    class={[
        "rounded-xl border-solid border-black/40 border-4 mb-4 max-sm:mb-0.5 max-lg:mb-1 dark:text-gray-100 text-gray-800 pokemon bg-no-repeat p-0.5 max-sm:border-2",
        pokeColor[pokemon.name],
        darkPokeColor[pokemon.name],
        pokemon.name,
        props.class,
    ]}
    data-index={index}
  >
  <div class="p-2 max-sm:text-xs max-sm:p-0.5">
    <div class="flex flex-row items-center justify-between">
      {#if handlerClass }
        <span class={handlerClass}> <Handler /></span>
      {/if}
      <div class="">{ pokemon.name }</div>
      <div class="dark:text-gray-100/40 max-sm:text-xs text-gray-800/40">
        #{ pokemon.order }
      </div>
    </div>
    <img
        src={pokemon.sprites.front_default}
        class="aspect-square select-none h-24 w-24"
        alt="pokemon"
      />
  </div>
  <div class="w-11/12 mx-auto bg-gray-100/20 rounded-md p-2 max-sm:p-1 text-sm max-sm:text-xs grid gap-1 grid-cols-2">
    {#each pokemon.types as pokemonType}
      <div>{pokemonType.type.name}</div>    
    {/each}
  </div>
  {#if hasRemove}
  <div class="px-1 mx-2 py-1 cursor-pointer">
    <button onclick={()=>{removeEventNotUndefined(index)}}>
        <Trash color="red"  />
    </button>
  </div>
  {/if}
</div>
<style>
  .pokemon {
    margin-top: 0rem !important;
    background-image: url("../../../assets/pokemon-bg.svg");
    transition: background-color 200ms ease-in;
    transition: opacity 200ms ease;
  }
  :is([data-theme="dark"] .bulbasaur.dragging-pokemon),
  :is([data-theme="dark"] .ivysaur.dragging-pokemon),
  :is([data-theme="dark"] .venusaur.dragging-pokemon),
  :is([data-theme="dark"] .chikorita.dragging-pokemon),
  :is([data-theme="dark"] .bayleef.dragging-pokemon),
  :is([data-theme="dark"] .meganium.dragging-pokemon),
  :is([data-theme="dark"] .treecko.dragging-pokemon),
  :is([data-theme="dark"] .grovyle.dragging-pokemon),
  :is([data-theme="dark"] .sceptile.dragging-pokemon) {
    background-color: #5ec8a3 !important;
  }
  :global(.pokemon.removed){
    opacity: 0;
  }
  
  .bulbasaur.dragging-pokemon,
  .ivysaur.dragging-pokemon,
  .venusaur.dragging-pokemon,
  .chikorita.dragging-pokemon,
  .bayleef.dragging-pokemon,
  .meganium.dragging-pokemon,
  .treecko.dragging-pokemon,
  .grovyle.dragging-pokemon,
  .sceptile.dragging-pokemon {
    background-color: #84efc9 !important;
  }
  
  :is([data-theme="dark"] .charmander.dragging-pokemon),
  :is([data-theme="dark"] .charmeleon.dragging-pokemon),
  :is([data-theme="dark"] .charizard.dragging-pokemon),
  :is([data-theme="dark"] .cyndaquil.dragging-pokemon),
  :is([data-theme="dark"] .quilava.dragging-pokemon),
  :is([data-theme="dark"] .typhlosion.dragging-pokemon),
  :is([data-theme="dark"] .torchic.dragging-pokemon),
  :is([data-theme="dark"] .combusken.dragging-pokemon),
  :is([data-theme="dark"] .blaziken.dragging-pokemon) {
    background-color: #b45951 !important;
  }
  
  .charmander.dragging-pokemon,
  .charmeleon.dragging-pokemon,
  .charizard.dragging-pokemon,
  .cyndaquil.dragging-pokemon,
  .quilava.dragging-pokemon,
  .typhlosion.dragging-pokemon,
  .torchic.dragging-pokemon,
  .combusken.dragging-pokemon,
  .blaziken.dragging-pokemon {
    background-color: #ff9084 !important;
  }
  
  :is([data-theme="dark"] .squirtle.dragging-pokemon),
  :is([data-theme="dark"] .wartortle.dragging-pokemon),
  :is([data-theme="dark"] .blastoise.dragging-pokemon),
  :is([data-theme="dark"] .totodile.dragging-pokemon),
  :is([data-theme="dark"] .croconaw.dragging-pokemon),
  :is([data-theme="dark"] .feraligatr.dragging-pokemon),
  :is([data-theme="dark"] .mudkip.dragging-pokemon),
  :is([data-theme="dark"] .marshtomp.dragging-pokemon),
  :is([data-theme="dark"] .swampert.dragging-pokemon) {
    background-color: #6dbafe !important;
  }
  
  .squirtle.dragging-pokemon,
  .wartortle.dragging-pokemon,
  .blastoise.dragging-pokemon,
  .totodile.dragging-pokemon,
  .croconaw.dragging-pokemon,
  .feraligatr.dragging-pokemon,
  .mudkip.dragging-pokemon,
  .marshtomp.dragging-pokemon,
  .swampert.dragging-pokemon {
    background-color: #66b7fd !important;
  }
  </style>
  
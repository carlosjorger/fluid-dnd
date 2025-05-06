import { useDragAndDrop } from "fluid-dnd/react";
import type { Pokemon } from "../Pokemon";
import { fetchPokemons } from "@/server/pokemonServer";
import { PokemonComponent } from "./PokemonComponent";
import { useEffect } from "react";

export const GroupOfHorizontalListOfPokemons: React.FC = () => {
  const [ parent, listOfPokemons, setPokemons ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
    droppableGroup: "group",
    direction: "horizontal",
    draggingClass: "dragging-pokemon",
    droppableClass:'hover'
  });
  const [ parent2, listOfPokemons2, setPokemons2 ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
    droppableGroup: "group",
    direction: "horizontal",
    draggingClass: "dragging-pokemon",
    droppableClass:'hover'
  });
  const [ parent3, listOfPokemons3, setPokemons3 ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
    droppableGroup: "group",
    direction: "horizontal",
    draggingClass: "dragging-pokemon",
    droppableClass:'hover'
  });
  useEffect(() => { 
      const fetchPokemonse = async () => {
          const newPokemons = await fetchPokemons(9);
          setPokemons(newPokemons);
          const newPokemons2 = await fetchPokemons(9, 151);
          setPokemons2(newPokemons2);
          const newPokemons3 = await fetchPokemons(9, 251);
          setPokemons3(newPokemons3);
      }
      fetchPokemonse();
  }, [])

  return (
    <div
      className="flex max-sm:justify-center flex-col gap-4 max-sm:gap-0.5 items-start"
    >
      <div
        ref={parent}
        className="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
      >
        {
          listOfPokemons.map((pokemon, index) => (
            <PokemonComponent
              key={pokemon.name}
              className="min-w-44 max-sm:min-w-32"
              index={index}
              pokemon={pokemon}
            />
          ))
        }
      </div>
      <div
        ref={parent2}
        className="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
      >
        {
          listOfPokemons2.map((pokemon, index) => (
            <PokemonComponent
              key={pokemon.name}
              className="min-w-44 max-sm:min-w-32"
              index={index}
              pokemon={pokemon}
            />
          ))
        }
      </div>
      <div
        ref={parent3}
        className="pokemon-generation bg-gray-200/60 border-solid w-full border-black/40 rounded-2xl border-4 max-lg:p-1 p-4 max-sm:p-0.5 max-sm:border-2 flex flex-row overflow-x-auto gap-2 max-sm:gap-1"
      >
        {
          listOfPokemons3.map((pokemon, index) => (
            <PokemonComponent
              key={pokemon.name}
              className="min-w-44 max-sm:min-w-32"
              index={index}
              pokemon={pokemon}
            />
          ))
        }
      </div>
    </div>
  )
}

import { useDragAndDrop } from "fluid-dnd/react";
import type { Pokemon } from "../Pokemon";
import { fetchPokemons } from "@/server/pokemonServer";
import { PokemonComponent } from "./PokemonComponent";
import { useEffect } from "react";

export const SingleHorizontalListOfPokemonsAutoscroll: React.FC = () => {
  const [ parent, listOfPokemons, setPokemons ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
    direction: "horizontal",
    draggingClass: "dragging-pokemon",
  });
  useEffect(() => { 
      const fetchPokemonse = async () => {
          const newPokemons = await fetchPokemons(9);
          setPokemons(newPokemons);
      }
      fetchPokemonse();
  }, [])

  return (
    <div className="flex max-sm:justify-center items-start">
      <div
        ref={parent}
        className="bg-gray-200/60 border-solid border-black/40 rounded-2xl border-4 p-4 max-sm:p-2 flex flex-row overflow-auto gap-2 max-sm:gap-1"
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
    </div>
  )
}

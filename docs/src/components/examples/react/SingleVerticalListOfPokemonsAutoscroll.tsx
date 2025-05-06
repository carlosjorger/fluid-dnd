import { useDragAndDrop } from "fluid-dnd/react";
import type { Pokemon } from "../Pokemon";
import { fetchPokemons } from "@/server/pokemonServer";
import { PokemonComponent } from "./PokemonComponent";
import { useEffect } from "react";

export const SingleVerticalListOfPokemonsAutoscroll: React.FC = () => {
  const [ parent, listOfPokemons, setPokemons ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
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
        className="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block overflow-auto max-h-[33rem]"
      >
        {
          listOfPokemons.map((pokemon, index) => (
            <PokemonComponent
              key={pokemon.name}
              index={index}
              pokemon={pokemon}
            />
          ))
        }
      </div>
    </div>
  )
}

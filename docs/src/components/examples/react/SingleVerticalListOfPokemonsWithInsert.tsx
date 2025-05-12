import { useDragAndDrop } from "fluid-dnd/react";
import type { Pokemon } from "../Pokemon";
import { fetchPokemons } from "@/server/pokemonServer";
import { PokemonComponent } from "./PokemonComponent";
import { useEffect, useState } from "react";

export const SingleVerticalListOfPokemonsWithInsert: React.FC = () => {
  const [ parent, listOfPokemons, setPokemons, insertAt ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
    removingClass: "removed",
    delayBeforeRemove: 300,
    draggingClass: "dragging-pokemon",
  });
  const [pokemonToAdd, setPokemonToAdd] = useState<Pokemon>();
  const [pokemonsToSelected, setPokemonsToSelected] = useState<Pokemon[]>([]);

  function insertPokemon(){
    const lastPosition = listOfPokemons.length
    if (pokemonToAdd) {
      insertAt(lastPosition, pokemonToAdd)
      console.log(lastPosition)
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pokemon = pokemonsToSelected.find((pokemon) => pokemon.name === event.target.value);
    if (pokemon) {
      setPokemonToAdd(pokemon);
    }
  };
  useEffect(() => { 
      const fetchInitialPokemons = async () => {
          const newPokemons = await fetchPokemons(3);
          setPokemons(newPokemons);
      }
      fetchInitialPokemons();
  }, [])
  useEffect(()=>{
    const fetchPokemonsToSelect = async () => {
      var pokemons = await fetchPokemons(10,0, listOfPokemons)
      setPokemonsToSelected(pokemons);
      const [firstPokemon] = pokemons
      if (firstPokemon) {
        setPokemonToAdd(firstPokemon)
      }

    }
    fetchPokemonsToSelect();
  },[listOfPokemons])
  return (
    <div className="flex max-sm:justify-center items-start">
      <div className="flex flex-col gap-4">
        <div
          ref={parent}
          className="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
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
        <div className="flex gap-4 max-sm:flex-col">
          <select  className="rounded-lg bg-gray-700 p-2 w-60" value={pokemonToAdd?.name} onChange={handleChange}>
            <option disabled>Please select one</option>
            {
              pokemonsToSelected.map((pokemon) => (
                <option key={pokemon.name} value={pokemon.name}>{pokemon.name}</option>
              ))
            }
          </select>
          <button className="rounded-lg border-2 hover:bg-gray-700 transition-colors" onClick={insertPokemon}>Add pokemon</button>
        </div>
      </div>
    </div>
  )
}

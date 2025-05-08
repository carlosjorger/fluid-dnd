import { Pokemon } from "../../../../docs/src/components/examples/Pokemon.ts";
import { fetchPokemons } from "../../../../docs/src/server/pokemonServer.ts";
import useDragAndDrop from '../../../../src/react/useDragAndDrop';
import PokemonComponent from "./pokemonComponent";
import './pokemon.css'
import { useEffect, useState } from "react";

type Props = {
  render?: boolean
}

const groupOfPokemonlists: React.FC<Props> = ({ render=true }) => {
    
    const [ parent, pokemonsValue, setPokemons ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
        delayBeforeRemove: 300,
        droppableGroup: 'pokemon-group'
    });
    const [ parent2, pokemonsValue2, setPokemons2, insertAt ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
        delayBeforeRemove: 300,
        droppableGroup: 'pokemon-group'
    });
    const [pokemonToAdd, setPokemonToAdd] = useState<Pokemon>();
    const [pokemonsToSelected, setPokemonsToSelected] = useState<Pokemon[]>([]);
    function insertPokemon(){
        const lastPosition = pokemonsValue2.length
        if (pokemonToAdd) {
          insertAt(lastPosition, pokemonToAdd)
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const pokemon = pokemonsToSelected.find((pokemon) => pokemon.name === event.target.value);
        if (pokemon) {
          setPokemonToAdd(pokemon);
        }
    };
    useEffect(() => { 
        const fetchPokemonse = async () => {
            const newPokemons = await fetchPokemons(9);
            setPokemons(newPokemons);
            const newPokemons2 = await fetchPokemons(9, 151);
            setPokemons2(newPokemons2);
        }
        fetchPokemonse();
    }, [])
    useEffect(()=>{
        const fetchPokemonsToSelect = async () => {
          var pokemons = await fetchPokemons(10,0, [...pokemonsValue, ...pokemonsValue2])
          setPokemonsToSelected(pokemons);
          setPokemonToAdd(pokemons[0])
        }
        fetchPokemonsToSelect();
      },[pokemonsValue2])
    return (
      <>
        {render &&
          <div>
            <div className="pokemon-group">
              <div className="pokemon-list" ref={parent}>
                  {pokemonsValue.map((pokemon, index) => (
                      <PokemonComponent
                          key={pokemon.name}
                          index={index}
                          pokemon={pokemon}/>
                  ))}
              </div>
              <div className="pokemon-list" ref={parent2}>
                  {pokemonsValue2.map((pokemon, index) => (
                      <PokemonComponent
                          key={pokemon.name}
                          index={index}
                          pokemon={pokemon}/>
                  ))}
              </div>
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
        }
      </>
    )
}

export default groupOfPokemonlists;
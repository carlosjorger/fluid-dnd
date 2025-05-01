import { Pokemon } from "../../../docs/src/components/examples/Pokemon.ts";
import { fetchPokemons } from "../../../docs/src/server/pokemonServer.ts";
import useDragAndDrop from '../../../src/react/useDragAndDrop';
import PokemonComponent from "./pokemonComponent";
import './pokemon.css'
import { useEffect } from "react";


const groupOfPokemonlists: React.FC = () => {
    
    const [ parent, pokemonsValue, setPokemons ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
        delayBeforeRemove: 300,
        droppableGroup: 'pokemon-group'
    });
    const [ parent2, pokemonsValue2, setPokemons2 ] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
        delayBeforeRemove: 300,
        droppableGroup: 'pokemon-group'
    });
    useEffect(() => { 
        const fetchPokemonse = async () => {
            const newPokemons = await fetchPokemons(9);
            setPokemons(newPokemons);
            const newPokemons2 = await fetchPokemons(9, 151);
            setPokemons2(newPokemons2);
        }
        fetchPokemonse();
    }, [])

    return (
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
    )
}

export default groupOfPokemonlists;
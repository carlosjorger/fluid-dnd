import type { Pokemon } from "../../../../docs/src/components/examples/Pokemon";
import './pokemon.css'

const pokeColor = {
    bulbasaur: "#64dbb2",
    ivysaur: "#64dbb2",
    venusaur: "#64dbb2",
    charmander: "#f0776a",
    charmeleon: "#f0776a",
    charizard: "#f0776a",
    squirtle: "#58abf6",
    wartortle: "#58abf6",
    blastoise: "#58abf6",
  
    green: "#64dbb2",
    orange: "#f0776a",
    blue: "#58abf6",
    yellow: "#facd4b",
    purple: "#9f5bba",
    coco: "#ca8179",
  } as const;
interface Props{
    pokemon: Pokemon,
    index: number,
}
const pokemonComponent: React.FC<Props> = ({ pokemon, index }) => {
    return(
        <div data-index={index} className={`${pokeColor[pokemon.name]} pokemon ${pokemon.name}`} style={
          {
            backgroundColor: pokeColor[pokemon.name],
          }
        }>
            <div style={{padding: "2px"}}>
              <div>
                <div>{ pokemon.name }</div>
                <div>#{ pokemon.order }</div>
              </div>
              <img src={pokemon.sprites.front_default} alt="pokemon" />
            </div>
        <div>
            {pokemon.types.map((pokemonType) => (
                <div key={ pokemonType.type.name}>
                    { pokemonType.type.name }
                </div>
                
            ))}
        </div>
      </div>
    )
};
export default pokemonComponent;

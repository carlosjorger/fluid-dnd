import type { Pokemon } from "../../../docs/src/components/examples/Pokemon";
import './pokemon.css'

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
interface Props{
    pokemon: Pokemon,
    index: number,
}
const pokemonComponent: React.FC<Props> = ({ pokemon, index }) => {
    return(
        <div data-index={index} className={pokeColor[pokemon.name]}>
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
  {/* <div>
    {#each pokemon.types as pokemonType}
      <div>
        { pokemonType.type.name }
      </div>
      
    {/each}
  </div> */}
        </div>
    )
};
export default pokemonComponent;

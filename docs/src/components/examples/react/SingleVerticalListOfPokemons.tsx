import { useDragAndDrop } from "fluid-dnd/react";
import type { Pokemon } from "../Pokemon";
import { fetchPokemons } from "@/server/pokemonServer";
import { PokemonComponent } from "./PokemonComponent";
import { useEffect, useState } from "react";
import { TouchDelaySilder } from "./touchDelaySilder.tsx";

export const SingleVerticalListOfPokemons: React.FC = () => {
	const [delay, setDelay] = useState(150);
	const [parent, listOfPokemons, setPokemons] = useDragAndDrop<Pokemon, HTMLDivElement>([], {
		draggingClass: "dragging-pokemon",
		delayBeforeTouchMoveEvent: delay
	});

	useEffect(() => {
		const fetchPokemonse = async () => {
			const newPokemons = await fetchPokemons(3);
			setPokemons(newPokemons);
		};
		fetchPokemonse();
	}, [delay]);

	return (
		<div className="flex-col gap-4">
			<div className="flex max-sm:justify-center items-start">
				<div
					ref={parent}
					className="bg-gray-200/60 border-solid border-black/40 rounded-2xl w-60 border-4 p-4 block"
				>
					{listOfPokemons.map((pokemon, index) => (
						<PokemonComponent key={pokemon.name} index={index} pokemon={pokemon} />
					))}
				</div>
			</div>
			<TouchDelaySilder
				value={delay}
				changeDelay={(newDelay) => {
					setDelay(newDelay);
				}}
			/>
		</div>
	);
};

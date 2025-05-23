import { useDragAndDrop } from "fluid-dnd/react";
import "./Number.css";
import type { Coordinate } from "fluid-dnd";
type Props = {
	lockAxis: boolean;
	gridTranslate: boolean;
};
export const ListWithMappedCoordinates: React.FC<Props> = ({ lockAxis, gridTranslate }) => {
	const mappers = [
		(coordinate: Coordinate) => {
			return coordinate;
		}
	];
	if (lockAxis) {
		mappers.push((coordinate: Coordinate) => {
			return {
				x: 0,
				y: coordinate.y
			};
		});
	}
	if (gridTranslate) {
		mappers.push(({ x, y }: Coordinate) => {
			const gridSize = 25.78;
			return {
				x: Math.ceil(x / gridSize) * gridSize,
				y: Math.ceil(y / gridSize) * gridSize
			};
		});
	}
	const [parent, listValue] = useDragAndDrop<number, HTMLUListElement>([...Array(20).keys()], {
		coordinateTransform: mappers
	});
	return (
		<ul ref={parent} className="block px-2 overflow-y-auto h-[257px] pl-7 w-4/5">
			{listValue.map((element, index) => (
				<li className="solid mt-1 border-2  py-2 px-3" data-index={index} key={element}>
					{element}
				</li>
			))}
		</ul>
	);
};

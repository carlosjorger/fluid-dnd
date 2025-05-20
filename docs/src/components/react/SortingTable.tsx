import { useDragAndDrop } from "fluid-dnd/react";
import "./Number.css";
import "./css/Person.css";
import "./css/Table.css";

export const SortingTable: React.FC = () => {
	type Person = {
		name: string;
		age: number;
		alias: string;
	};
	const [parent, listValue] = useDragAndDrop<Person, HTMLTableSectionElement>([
		{ name: "Carlos", age: 26, alias: "Carli" },
		{ name: "Jorgito", age: 34, alias: "Pipo" },
		{ name: "Ivis", age: 68, alias: "Mamá" }
	]);

	return (
		<table className="table-auto border-collapse">
			<thead>
				<tr>
					<th>Name</th>
					<th>Age</th>
					<th>Alias</th>
				</tr>
			</thead>
			<tbody ref={parent}>
				{listValue.map((person, index) => (
					<tr className="person" data-index={index} key={person.name}>
						<td>{person.name}</td>
						<td>{person.age}</td>
						<td>{person.alias}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

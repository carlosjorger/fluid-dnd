interface Props {
	changeDelay: (newDelay: number) => void;
	value: number;
}

export const TouchDelaySilder: React.FC<Props> = ({ changeDelay, value }) => {
	function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
		const target = event.target as HTMLInputElement;
		changeDelay(parseFloat(target.value));
	}
	return (
		<div className="flex flex-col gap-8 delay-menu items-center" style={{ marginTop: "3rem" }}>
			<h3>Delay before touch move event</h3>
			<div className="w-full max-w-xs">
				<input
					type="range"
					min="150"
					max="750"
					value={value}
					className="range w-full"
					step="150"
					onChange={handleInput}
				/>
				<div className="flex justify-between px-2.5 mt-2 text-xs">
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
					<span>|</span>
				</div>
				<div className="flex justify-between mt-2 text-xs">
					<span>150</span>
					<span>300</span>
					<span>450</span>
					<span>600</span>
					<span>750</span>
				</div>
			</div>
		</div>
	);
};

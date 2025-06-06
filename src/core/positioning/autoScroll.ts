import { Coordinate, Direction } from '..';
import { draggableIsCompleteOutside, getPropByDirection } from '../utils/GetStyles';
const scrollByDirection = (element: HTMLElement, direction: Direction, scrollAmount: number) => {
	if (scrollAmount == 0) {
		return;
	}
	if (direction === 'vertical') {
		element.scrollBy(0, scrollAmount);
	} else {
		element.scrollBy(scrollAmount, 0);
	}
};
export const useScroll = (draggedElement: HTMLElement | undefined) => {
	let lastScrollAmount = 0.5;
	const minScrollAmountDiff = 0.03;
	const updateScrollByPosition = (
		direction: Direction,
		parent: HTMLElement,
		position: {
			top: number;
			left: number;
		},
		translate: Coordinate
	) => {
		if (!draggedElement) {
			return;
		}
		const { before, distance, axis, getRect } = getPropByDirection(direction);
		const distanceValue = getRect(draggedElement)[distance];

		const parentBoundingClientRect = getRect(parent);
		const positionInsideParent =
			position[before] - parentBoundingClientRect[before] + translate[axis];

		const parentDistance = parentBoundingClientRect[distance];
		const totalDistance = parentDistance - distanceValue;
		const relativePosition = positionInsideParent / totalDistance;
		const relativeDistanceValue = distanceValue / totalDistance;

		const velocity = 0.25;
		const infLimit = 0.2;
		const upperLimit = 0.8;
		let percent = 0;
		const isOutside = draggableIsCompleteOutside(draggedElement, parent);
		if (!isOutside && relativePosition < infLimit && relativePosition > -relativeDistanceValue) {
			percent = scrollFuncionToStart(relativePosition < 0 ? 0 : relativePosition, infLimit);
		} else if (
			!isOutside &&
			relativePosition > upperLimit &&
			relativePosition < 1 + relativeDistanceValue
		) {
			percent = scrollFuncionToEnd(relativePosition, upperLimit);
		}
		const scrollAmount = velocity * distanceValue * percent;

		lastScrollAmount =
			Math.sign(scrollAmount) *
			Math.min(Math.abs(scrollAmount), Math.abs(lastScrollAmount) + minScrollAmountDiff);

		scrollByDirection(parent, direction, lastScrollAmount);
	};
	const scrollFuncionToStart = (relativePosition: number, infLimit: number) => {
		return Math.pow(relativePosition / infLimit, 1 / 3) - 1;
	};
	const scrollFuncionToEnd = (relativePosition: number, upperLimit: number) => {
		return Math.pow((1 / (1 - upperLimit)) * (relativePosition - upperLimit), 3);
	};

	return [updateScrollByPosition] as const;
};

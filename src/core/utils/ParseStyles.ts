import { GapStyle } from '../../../index';
import { getPropByDirection, getRect, parseFloatEmpty } from './GetStyles';
import { Direction } from '..';

export const getNumberFromPixels = (pixels: string) => {
	if (pixels.length == 0) {
		return 0;
	}
	return parseFloatEmpty(pixels.replace('px', ''));
};
export const computeGapPixels = (element: Element, gapType: GapStyle) => {
	const gap = getComputedStyle(element)[gapType];
	if (gap.match('%')) {
		const gap_percent = parseFloatEmpty(gap.replace('%', ''));
		const { width } = getRect(element);
		return width * (gap_percent / 100);
	}
	const gap_px = getNumberFromPixels(gap);
	return gap_px;
};
export const gapAndDisplayInformation = (
	element: Element | null,
	gapStyle: GapStyle
): [number, boolean] => {
	if (!(element instanceof Element)) return [0, false];
	const gap = computeGapPixels(element, gapStyle);
	const display = getComputedStyle(element).display;
	const hasGaps = gap > 0 || display === 'flex';
	return [gap, hasGaps];
};
export const getBeforeStyles = (element: HTMLElement): [number, number] => {
	const { top, left } = getComputedStyle(element);
	return [getNumberFromPixels(top), getNumberFromPixels(left)];
};
export const getGapInfo = (element: HTMLElement | null, direction: Direction) => {
	const { gap: gapStyle } = getPropByDirection(direction);
	return gapAndDisplayInformation(element, gapStyle);
};
export const getGapPixels = (element: HTMLElement, direction: Direction) => {
	const [gap, hasGaps] = getGapInfo(element, direction);
	if (hasGaps) {
		return gap;
	}
	return 0;
};

export type BeforeMargin = 'marginTop' | 'marginLeft';
export type AfterMargin = 'marginBottom' | 'marginRight';
export type GapStyle = 'columnGap' | 'rowGap';
export type BorderWidth = 'borderTopWidth' | 'borderLeftWidth';
export type PaddingBefore = 'paddingLeft' | 'paddingTop';
export type Distance = 'width' | 'height';
export type Before = 'left' | 'top';
export type After = 'right' | 'down';
export type Axis = 'x' | 'y';
export type Offset = 'offsetX' | 'offsetY';
export type Scroll = 'scrollX' | 'scrollY';
export type ScrollElement = 'scrollTop' | 'scrollLeft';
export type InnerDistance = 'innerWidth' | 'innerHeight';
export type Page = 'pageX' | 'pageY';
export type MoveEvent = 'mousemove' | 'touchmove';
export type OnLeaveEvent = 'mouseup' | 'touchend';
export type TouchEvent = 'touchstart' | 'touchmove' | 'touchend';
export type OffsetElement = 'offsetLeft' | 'offsetTop';
export type ScrollDistance = 'scrollHeight' | 'scrollWidth';
export type ClientDistance = 'clientHeight' | 'clientWidth';
export type Coordinate = { x: number; y: number };
export type ElementPosition = {
	top: number;
	left: number;
};
export type Translate = {
	height: number;
	width: number;
};
export type ElementScroll = {
	scrollLeft: number;
	scrollTop: number;
};
export type DragMouseTouchEvent = {
	readonly clientX: number;
	readonly clientY: number;
	readonly pageX: number;
	readonly pageY: number;
	readonly screenX: number;
	readonly screenY: number;
	readonly target: EventTarget | null;
	readonly offsetX: number;
	readonly offsetY: number;
};
export type TransformEvent = {
	readonly pageX: number;
	readonly pageY: number;
	readonly target: EventTarget | null;
	readonly offsetX: number;
	readonly offsetY: number;
};
export type WindowScroll = {
	readonly scrollX: number;
	readonly scrollY: number;
};
export type fixedSize = {
	fixedWidth?: string;
	fixedHeight?: string;
};

export type OffsetCoordinate = {
	offsetX: number;
	offsetY: number;
};

export type Size = {
	width: number;
	height: number;
};

export type Position = {
	x: number;
	y: number;
};

export enum WindowId {
	NOTEPAD = 'notepad',
	CMD = 'cmd',
	CALCULATOR = 'calculator',
	PAINT = 'paint',
	MINESWEEPER = 'minesweeper',
}

export type GlobalWindowState = {
	windowId: WindowId;
	isMinimized: boolean;
	isFocused: boolean;
	zIndex: number;
};

export type WindowChildProps = {
	setWindowSize: (size: Partial<Size>) => void;
};

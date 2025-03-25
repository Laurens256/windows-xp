import { Notepad, Command, Calculator, Paint, Minesweeper } from '$components/apps';
import { WindowId, type GlobalWindowState, type WindowChildProps } from '$types';
import type { Component } from 'svelte';
import type { Props as WindowComponentProps } from '$components/Window/types';
import { IconAppNotepad, IconAppPaint, IconAppCalculator, IconAppCmd, IconAppMinesweeper } from '$icons/apps';

type WindowData = {
	component: Component<WindowChildProps> | Component;
	windowTitle: string;
	icon: string;
	hideDesktopEntry?: boolean;
} & Partial<Omit<WindowComponentProps, keyof GlobalWindowState | 'component'>>;

const windowsData: Record<WindowId, WindowData> = {
	[WindowId.NOTEPAD]: {
		component: Notepad,
		windowTitle: 'Notepad',
		icon: IconAppNotepad,
	},
	[WindowId.CMD]: {
		component: Command,
		windowTitle: 'cmd.exe',
		icon: IconAppCmd,
	},
	[WindowId.CALCULATOR]: {
		component: Calculator,
		windowTitle: 'Calculator',
		icon: IconAppCalculator,
		sizeToContent: true,
	},
	[WindowId.PAINT]: {
		component: Paint,
		windowTitle: 'Paint',
		icon: IconAppPaint,
		minSize: { width: 300, height: 300 },
	},
	[WindowId.MINESWEEPER]: {
		component: Minesweeper,
		windowTitle: 'Minesweeper',
		icon: IconAppMinesweeper,
		sizeToContent: true,
	},
};

export default windowsData;

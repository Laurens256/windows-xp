import type { GlobalWindowState, Size, WindowChildProps } from '$types';
import type { Snippet } from 'svelte';

type Props = {
	windowTitle: string;
	initialSize?: Partial<Size>;
	minSize?: Partial<Size>;
	noActionButtons?: boolean;
	notMoveable?: boolean;
	notResizable?: boolean;
	noMinimize?: boolean;
	noMaximize?: boolean;
	noClose?: boolean;
	icon: string;
	component: Snippet<[WindowChildProps]>;
	sizeToContent?: boolean;
} & GlobalWindowState;

export type { Props };

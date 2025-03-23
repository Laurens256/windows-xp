import { type GlobalWindowState, WindowId } from '$types';

const windows: { [id in WindowId]?: GlobalWindowState } = $state({});

type ChangeWindowStateKey = Exclude<keyof GlobalWindowState, 'windowId'>;
type BooleanWindowStateKey = Exclude<ChangeWindowStateKey, 'zIndex'>;

const changeWindowState = <K extends ChangeWindowStateKey>(
	id: WindowId,
	key: K,
	value: GlobalWindowState[K],
) => {
	const window = windows[id];
	if (window) {
		window[key] = value;
	}
};
const toggleWindowState = (
	id: WindowId,
	key: BooleanWindowStateKey,
) => {
	const window = windows[id];
	if (window) {
		const newVal = !window[key];
		window[key] = newVal;
		return newVal;
	}
};

const findHighestIndexUnminizedWindow = (): WindowId | undefined => {
	let highestZIndexWindow: GlobalWindowState | undefined;

	for (const window of Object.values(windows)) {
		const hasHigherZIndex = highestZIndexWindow === undefined || window.zIndex > highestZIndexWindow.zIndex;

		if (!window.isMinimized && (hasHigherZIndex)) {
			highestZIndexWindow = window;
		}
	}

	return highestZIndexWindow?.windowId;
};

export default {
	get windows() {
		return windows;
	},

	setFocusedWindow(id: WindowId | null | undefined) {
		const maxZIndex = Math.max(
			...Object.values(windows).map(({ zIndex }) => zIndex),
			0,
		);

		Object.values(windows).forEach((window) => {
			const willBecomeFocused = window.windowId === id;
			window.isFocused = willBecomeFocused;

			if (willBecomeFocused) {
				window.zIndex = maxZIndex + 1;
			}
		});
	},

	closeWindow(id: WindowId) {
		delete windows[id];
	},
	openWindow(id: WindowId) {
		windows[id] = {
			windowId: id,
			isMinimized: false,
			isFocused: true,
			zIndex: Object.keys(windows).length + 1,
		};
		this.setFocusedWindow(id);
	},

	minimizeWindow(id: WindowId) {
		changeWindowState(id, 'isMinimized', true);

		const nextWindowToFocus = findHighestIndexUnminizedWindow();
		this.setFocusedWindow(nextWindowToFocus);
	},
	unMinimizeWindow(id: WindowId) {
		changeWindowState(id, 'isMinimized', false);
		this.setFocusedWindow(id);
	},
	toggleWindowMinimize(id: WindowId) {
		const willBeMinimized = toggleWindowState(id, 'isMinimized');

		if (willBeMinimized) {
			const nextWindowToFocus = findHighestIndexUnminizedWindow();
			this.setFocusedWindow(nextWindowToFocus);
		} else {
			this.setFocusedWindow(id);
		}
	},
};

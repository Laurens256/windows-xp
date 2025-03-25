import { type GlobalWindowState, WindowId } from '$types';
import { dev } from '$app/environment';

class WindowStore {
	private _windows = $state<{ [id in WindowId]?: GlobalWindowState }>({});

	get windows() {
		return this._windows;
	}
	public getWindow(id: WindowId) {
		return this._windows[id];
	}

	constructor(initialOpenWindows: WindowId[] = []) {
		for (const id of initialOpenWindows) {
			this.openWindow(id);
		}
	}

	private findHighestIndexUnminizedWindow(): WindowId | undefined {
		let highestZIndexWindow: GlobalWindowState | undefined;

		for (const window of Object.values(this._windows)) {
			const hasHigherZIndex = highestZIndexWindow === undefined || window.zIndex > highestZIndexWindow.zIndex;

			if (!window.isMinimized && (hasHigherZIndex)) {
				highestZIndexWindow = window;
			}
		}

		return highestZIndexWindow?.windowId;
	}

	private changeWindowState<T>(
		windowOrId: WindowId | GlobalWindowState | undefined,
		cb: (window: GlobalWindowState) => T,
	) {
		const window = typeof windowOrId === 'string' ? this._windows[windowOrId] : windowOrId;
		if (window) return cb(window);
	}

	public setFocusedWindow(id: WindowId | null | undefined) {
		const windows = Object.values(this._windows);
		const maxZIndex = Math.max(...windows.map(({ zIndex }) => zIndex), 0);

		for (const w of windows) {
			this.changeWindowState(w, (window) => {
				const willBecomeFocused = window.windowId === id;
				window.isFocused = willBecomeFocused;

				if (willBecomeFocused) {
					window.zIndex = maxZIndex + 1;
					window.isMinimized = false;
				}
			});
		}
	}

	public closeWindow(id: WindowId) {
		delete this._windows[id];
	}

	public openWindow(id: WindowId) {
		this._windows[id] = {
			windowId: id,
			isMinimized: false,
			isFocused: true,
			zIndex: Object.keys(this._windows).length + 1,
		};
		this.setFocusedWindow(id);
	}

	public focusOrMinimizeWindow(id: WindowId) {
		const window = this.getWindow(id);
		if (!window) return;

		if (window.isMinimized || !window.isFocused) {
			this.setFocusedWindow(id);
		} else {
			this.minimizeWindow(id);
		}
	}

	public minimizeWindow(id: WindowId) {
		this.changeWindowState(id, (window) => window.isMinimized = true);

		const nextWindowToFocus = this.findHighestIndexUnminizedWindow();
		this.setFocusedWindow(nextWindowToFocus);
	}
}

export default new WindowStore(dev ? [] : [WindowId.NOTEPAD]);

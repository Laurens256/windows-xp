import type { Size } from '$types';

class InnerContainerStore {
	private _innerContainer = $state<HTMLElement | null>(null);
	private _containerWidth = $state(0);
	private _containerHeight = $state(0);

	private _containerSize = $derived<Size>({ width: this._containerWidth, height: this._containerHeight });

	get element() {
		return this._innerContainer;
	}
	set element(newContainer: HTMLElement | null) {
		this._innerContainer = newContainer;
	}
	get size() {
		return this._containerSize;
	}
	get width() {
		return this._containerWidth;
	}
	set width(newWidth) {
		this._containerWidth = newWidth;
	}
	get height(){
		return this._containerHeight;
	}
	set height(newHeight) {
		this._containerHeight = newHeight;
	}
}

export default new InnerContainerStore();

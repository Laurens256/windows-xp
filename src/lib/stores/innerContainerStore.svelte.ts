import type { Size } from '$types';

let innerContainer = $state<HTMLElement | null>(null);
let containerWidth = $state(0);
let containerHeight = $state(0);

const containerSize = $derived<Size>({ width: containerWidth, height: containerHeight });

export default {
	get element() {
		return innerContainer;
	},
	set element(newContainer: HTMLElement | null) {
		innerContainer = newContainer;
	},
	get size() {
		return containerSize;
	},
	get width() {
		return containerWidth;
	},
	set width(newWidth) {
		containerWidth = newWidth;
	},
	get height(){
		return containerHeight;
	},
	set height(newHeight) {
		containerHeight = newHeight;
	},
};

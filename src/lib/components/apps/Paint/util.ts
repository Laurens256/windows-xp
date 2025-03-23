import type { PaintLayers } from '$apps/Paint/types';
import { PaintLayerId } from './constants';

const getLayerContexts = (parentElement: HTMLElement) => {
	const layerIds = Object.values(PaintLayerId);

	return Object.fromEntries(layerIds.map((layerId) => {
		const canvas = document.createElement('canvas');
		canvas.id = layerId;
		const context = canvas.getContext('2d', { willReadFrequently: true });

		if (!context) throw new Error(`
		Could not get canvas context for layer: ${layerId}.
		Your browser might not support canvas.
		`);

		canvas.style.position = 'absolute';
		canvas.style.top = '0';
		canvas.style.pointerEvents = 'none';

		parentElement.insertAdjacentElement('afterbegin', canvas);

		return [layerId, context];
	})) as PaintLayers;
};

const createTextField = (parentElement: HTMLElement) => {
	const element = document.createElement('input');
	element.ariaLabel = 'choose text';
	element.addEventListener('mousedown', (e) => e.stopImmediatePropagation());

	element.style.position = 'absolute';
	element.style.outline = '0';
	element.style.backgroundColor = 'transparent';
	element.style.display = 'none';

	parentElement.insertAdjacentElement('afterbegin', element);

	return element;
};

type HandleParentResizeProps = {
	resizerEntry: ResizeObserverEntry;
	layers: CanvasRenderingContext2D[];
};

const setDynamicCanvasSize = ({ resizerEntry, layers }: HandleParentResizeProps) => {
	const { width, height } = resizerEntry.contentRect;

	for (const ctx of layers) {
		let canvasData: ImageData | null = null;

		try {
			canvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		} catch { /* context lost but nothing broken */ }

		ctx.canvas.width = width;
		ctx.canvas.height = height;

		ctx.canvas.style.width = `${width}px`;
		ctx.canvas.style.height = `${height}px`;

		if (canvasData) {
			try {
				ctx.putImageData(canvasData, 0, 0);
			} catch { /* context lost but nothing broken */ }
		}
	}
};

export { setDynamicCanvasSize, getLayerContexts, createTextField };

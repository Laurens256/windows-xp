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

		Object.assign(canvas.style, {
			position: 'absolute',
			top: '0',
			pointerEvents: 'none',
		});

		parentElement.insertAdjacentElement('afterbegin', canvas);

		return [layerId, context];
	})) as PaintLayers;
};

const createTextField = (parentElement: HTMLElement) => {
	const element = document.createElement('input');
	element.ariaLabel = 'choose text';
	element.addEventListener('mousedown', (e) => e.stopImmediatePropagation());

	Object.assign(element.style, {
		position: 'absolute',
		outline: '0',
		backgroundColor: 'transparent',
		display: 'none',
	});

	parentElement.insertAdjacentElement('afterbegin', element);

	return element;
};

const createCursorElement = (parentElement: HTMLElement) => {
	const element = document.createElement('div');
	element.id = 'cursor';

	Object.assign(element.style, {
		position: 'absolute',
		pointerEvents: 'none',
		border: '1px solid #000',
		borderStyle: 'dashed',
		borderRadius: '50%',
		transform: 'translate(-50%, -50%)',
		boxShadow: 'inset 0 0 3px 2px white',
	});

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

export { setDynamicCanvasSize, getLayerContexts, createTextField, createCursorElement };

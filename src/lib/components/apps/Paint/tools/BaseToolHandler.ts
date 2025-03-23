import {
	type BaseToolHandlerProps,
	type PaintSelection,
	type SetPaintColors,
	type ToolHandler,
	type ToolHandlerFnProps,
	type ToolHandlerLifecycleFnProps,
} from '../types';
import { type ToolId, PaintLayerId } from '../constants';
import { pointUtil } from './utils';

// functions in this array will always have their super method called before child method
const functionsToExtend = [
	'onInitialize',
	'onActionStart',
	'onActionMove',
	'onActionEnd',
	'onMouseMove',
	'onDestroy',
] as const satisfies ReadonlyArray<keyof ToolHandler>;

abstract class BaseToolHandler implements ToolHandler {
	public toolId: ToolId;

	public paintLayer: CanvasRenderingContext2D;
	public selectionLayer: CanvasRenderingContext2D;
	public previewLayer: CanvasRenderingContext2D;
	public mousePreviewLayer: CanvasRenderingContext2D;

	public textField: HTMLInputElement;

	public makeSelection: (props: PaintSelection) => void;
	public setColors: SetPaintColors;

	private readonly isSelectionAware: boolean;

	protected constructor({
		toolId,
		isSelectionAware,
		setColors,
		makeSelection,
		layers,
		setError,
		textField,
	}: BaseToolHandlerProps) {
		this.selectionLayer = layers[PaintLayerId.SELECTION];
		this.previewLayer = layers[PaintLayerId.PREVIEW];
		this.paintLayer = layers[PaintLayerId.PAINT];
		this.mousePreviewLayer = layers[PaintLayerId.MOUSE_PREVIEW];

		this.textField = textField;

		this.toolId = toolId;
		this.isSelectionAware = isSelectionAware;
		this.setColors = setColors;
		this.makeSelection = makeSelection;

		// always call super method before fn method
		// offloads having to call super method manually
		// useful for doing repetitive checks (like checking for selection bounds)
		for (const funcName of functionsToExtend) {
			const originalFunction = this[funcName] as any; // can probably be solved with generics but cant be bothered
			const baseFunction = BaseToolHandler.prototype[funcName] as any;
			const shouldExtendFunction = originalFunction !== baseFunction;

			this[funcName] = (...props: Parameters<typeof baseFunction>) => {
				try {
					// if baseFunction returns false, skip inheritor function (if exists)
					const result = baseFunction.apply(this, props);
					if (shouldExtendFunction && result !== false) {
						return originalFunction.apply(this, props);
					}
				} catch (e) {
					setError(e);
				}
			};
		}
	}

	clearLayer(layer: CanvasRenderingContext2D) {
		layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
	}

	private forEachLayer(fn: (layer: CanvasRenderingContext2D) => void) {
		fn(this.paintLayer);
		fn(this.selectionLayer);
		fn(this.previewLayer);
		fn(this.mousePreviewLayer);
	}

	onInitialize({ selection }: ToolHandlerLifecycleFnProps): void | boolean {
		const clipPath = pointUtil.createPathFromPoints(selection, this.isSelectionAware);
		if (clipPath) {
			const paintLayer = this.paintLayer;

			paintLayer.save();
			paintLayer.clip(clipPath);
		}

		this.forEachLayer((layer) => {
			// make sure we don't double save context (bad)
			if (!(this.isSelectionAware && layer.canvas.id === PaintLayerId.PAINT)) {
				layer.save();
			}
		});

		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onActionStart(_: ToolHandlerFnProps): void | boolean {
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onActionMove(_: ToolHandlerFnProps): void | boolean {
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onActionEnd(_: ToolHandlerFnProps): void | boolean {
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onMouseMove(_: ToolHandlerFnProps): void | boolean {
		return true;
	}

	onDestroy({ selection }: ToolHandlerLifecycleFnProps): void | boolean {
		this.forEachLayer((layer) => {
			layer.restore();
		});

		this.clearLayer(this.mousePreviewLayer);

		// close any unfinished selections
		if (!selection.isClosed) {
			this.makeSelection({ isClosed: true, points: [] });
			this.clearLayer(this.selectionLayer);
		}

		return true;
	}
}

export default BaseToolHandler;

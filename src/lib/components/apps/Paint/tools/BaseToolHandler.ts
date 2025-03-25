import {
	type BaseToolHandlerProps,
	type PaintSelection, type Point,
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

	public cursorElement: HTMLElement;
	public paintLayer: CanvasRenderingContext2D;
	public selectionLayer: CanvasRenderingContext2D;
	public previewLayer: CanvasRenderingContext2D;
	public mousePreviewLayer: CanvasRenderingContext2D;

	public textField: HTMLInputElement;

	public makeSelection: (props: PaintSelection) => void;
	public setColors: SetPaintColors;

	private readonly isSelectionAware: boolean;
	private readonly isCursorSizeAware: boolean;
	private readonly withPreviewCursor: boolean;

	protected constructor({
		toolId,
		isSelectionAware,
		isCursorSizeAware,
		withPreviewCursor,
		setColors,
		makeSelection,
		layers,
		setError,
		textField,
		cursorElement,
	}: BaseToolHandlerProps) {
		this.selectionLayer = layers[PaintLayerId.SELECTION];
		this.previewLayer = layers[PaintLayerId.PREVIEW];
		this.paintLayer = layers[PaintLayerId.PAINT];
		this.mousePreviewLayer = layers[PaintLayerId.MOUSE_PREVIEW];
		this.cursorElement = cursorElement;

		this.textField = textField;

		this.toolId = toolId;
		this.isSelectionAware = isSelectionAware;
		this.isCursorSizeAware = isCursorSizeAware;
		this.withPreviewCursor = withPreviewCursor || this.isCursorSizeAware;

		this.setColors = setColors;
		this.makeSelection = makeSelection;

		// always call super method before fn method
		// offloads having to call super method manually
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

	onInitialize({ selection, cursorSize }: ToolHandlerLifecycleFnProps): void | boolean {
		this.forEachLayer((layer) => {
			layer.save();
		});

		const clipPath = pointUtil.createPathFromPoints(selection, this.isSelectionAware);
		if (clipPath) this.paintLayer.clip(clipPath);

		if (this.withPreviewCursor) {
			const size = this.isCursorSizeAware ? cursorSize : 5;
			Object.assign(this.cursorElement.style, {
				display: 'block',
				width: `${size}px`,
				height: `${size}px`,
			});
		} else {
			this.cursorElement.style.display = 'none';
		}

		return true;
	}

	private updateCursor({ x, y }: Point) {
		if (this.withPreviewCursor) {
			Object.assign(this.cursorElement.style, {
				left: `${x}px`,
				top: `${y}px`,
			});
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onActionStart(_: ToolHandlerFnProps): void | boolean {
		return true;
	}

	onActionMove({ toX, toY }: ToolHandlerFnProps): void | boolean {
		this.updateCursor({ x: toX, y: toY });

		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onActionEnd(_: ToolHandlerFnProps): void | boolean {
		return true;
	}

	onMouseMove({ toX, toY }: ToolHandlerFnProps): void | boolean {
		this.updateCursor({ x: toX, y: toY });

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

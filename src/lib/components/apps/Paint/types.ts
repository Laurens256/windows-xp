import { PaintLayerId, type ToolId } from './constants';

export type Point = { x: number; y: number }

export type PaintSelection = {
	isClosed: boolean;
	points: Point[];
};

export type PaintLayers = { [K in PaintLayerId]: CanvasRenderingContext2D };

export type SetPaintColors = (color: string | [string, string], index?: 0 | 1) => void;

export type ToolHandlerFnProps = {
	selection: PaintSelection;
	cursorSize: number;
	color: string;
	fromX: number;
	toX: number;
	fromY: number;
	toY: number;
};

export type ToolHandlerLifecycleFnProps = {
	color: string;
	selection: PaintSelection;
	cursorSize: number;
};

export type BaseToolHandlerPropsFromInheritor = {
	toolId: ToolId;
	isSelectionAware: boolean;
};
export type BaseToolHandlerPropsFromHandler = {
	makeSelection: (props: PaintSelection) => void;
	setColors: SetPaintColors;
	layers: PaintLayers;
	setError: (err: unknown) => void;
	textField: HTMLInputElement;
};
export type BaseToolHandlerProps = BaseToolHandlerPropsFromInheritor & BaseToolHandlerPropsFromHandler;

export interface ToolHandler {
	toolId: ToolId;

	makeSelection: (props: PaintSelection) => void;
	setColors: SetPaintColors;

	paintLayer: CanvasRenderingContext2D;
	mousePreviewLayer: CanvasRenderingContext2D;
	selectionLayer: CanvasRenderingContext2D;
	previewLayer: CanvasRenderingContext2D;

	textField: HTMLInputElement;

	clearLayer: (layer: CanvasRenderingContext2D) => void;

	onInitialize: (params: ToolHandlerLifecycleFnProps) => (void | boolean);

	onActionStart: (params: ToolHandlerFnProps) => (void | boolean);
	onActionMove: (params: ToolHandlerFnProps) => (void | boolean);
	onActionEnd: (params: ToolHandlerFnProps) => (void | boolean);
	onMouseMove: (e: ToolHandlerFnProps) => (void | boolean);

	onDestroy: (params: ToolHandlerLifecycleFnProps) => (void | boolean);
}

export type ToolHandlerClass<Props = BaseToolHandlerProps> = new (props: Props) => ToolHandler;

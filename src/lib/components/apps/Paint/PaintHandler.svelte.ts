import type {
	BaseToolHandlerPropsFromHandler,
	PaintLayers,
	PaintSelection,
	ToolHandler, ToolHandlerClass,
	ToolHandlerFnProps,
	ToolHandlerLifecycleFnProps,
} from './types';
import { resize } from 'svelte-resize-observer-action';
import { createTextField, getLayerContexts, setDynamicCanvasSize } from '$apps/Paint/util';

class PaintHandler {
	public canvasContainer = $state<HTMLElement | null>(null);
	private error = $state<unknown>(null);

	public layers: PaintLayers = null as unknown as PaintLayers; // is thrown if fails
	public textField: HTMLInputElement = null as unknown as HTMLInputElement;

	public colors: [string, string] = $state(['#000000', '#ffffff']);
	public currentTool = $state<ToolHandler | null>(null);

	public selection: PaintSelection = { isClosed: true, points: [] };

	private isPerformingAction = false;
	private lastX = 0;
	private lastY = 0;

	private cursorSize = 5;

	constructor() {
		$effect(() => {
			if (!this.canvasContainer) this.setError('Canvas container not found');

			let layers: PaintLayers;
			try {
				layers = getLayerContexts(this.canvasContainer);
			} catch (e) {
				this.setError(e);
			}
			this.layers = layers;
			this.textField = createTextField(this.canvasContainer);

			this.canvasContainer.addEventListener('mousedown', this.onMouseDown);
			this.canvasContainer.addEventListener('mousemove', this.onMouseMove);
			this.canvasContainer.addEventListener('mouseup', this.onMouseUp);
			// this.canvasContainer.addEventListener('mouseout', this.onMouseUp);

			new FontFace('tahoma', 'url(/fonts/tahoma.ttf)');

			const resizeManager = resize(
				this.canvasContainer, (e) => {
					setDynamicCanvasSize({
						resizerEntry: e,
						layers: Object.values(layers),
					});
					this.initializeTool();
				});

			return resizeManager.destroy;
		});

		$effect(() => {
			// throw error from effect so it is caught by svelte:boundary in Window component
			if (this.error) throw this.error;
		});
	}

	public setError: (error: unknown) => never = (error) => {
		this.error = error;
		return null as never; // when error is set, it will be thrown from our constructor $effect
	};

	private makeToolHandlerProps = (e: MouseEvent): ToolHandlerFnProps | null => {
		if (!this.currentTool) {
			return null;
		}

		const { offsetX, offsetY } = e;

		const props: ToolHandlerFnProps = {
			selection: this.selection,
			color: this.colors[0],
			cursorSize: this.cursorSize,
			fromX: this.lastX,
			toX: offsetX,
			toY: offsetY,
			fromY: this.lastY,
		};

		this.lastX = offsetX;
		this.lastY = offsetY;

		return props;
	};
	private makeToolHandlerLifecycleProps = (): ToolHandlerLifecycleFnProps => ({
		cursorSize: this.cursorSize,
		color: this.colors[0],
		selection: this.selection,
	});

	public setTool = (toolHandlerClass: ToolHandlerClass<BaseToolHandlerPropsFromHandler>) => {
		if (this.currentTool) {
			const props = this.makeToolHandlerLifecycleProps();
			this.currentTool.onDestroy(props);
		}

		const baseToolHandlerPropsFromHandler: BaseToolHandlerPropsFromHandler = {
			makeSelection: this.makeSelection,
			setColors: this.setColors,
			layers: this.layers,
			setError: this.setError,
			textField: this.textField,
		};

		this.currentTool = new toolHandlerClass(baseToolHandlerPropsFromHandler);
		this.initializeTool();
	};
	public initializeTool = () => {
		if (this.currentTool) {
			const props = this.makeToolHandlerLifecycleProps();
			this.currentTool.onInitialize(props);
		}
	};

	public setColors = (color: string | [string, string], index: 0 | 1 = 0) => {
		if (Array.isArray(color)) {
			this.colors = color;
		} else {
			this.colors[index] = color;
		}
		this.initializeTool();
	};

	private makeSelection = (newSelection: PaintSelection) => {
		this.selection = newSelection;
	};

	private onMouseDown = (e: MouseEvent) => {
		const props = this.makeToolHandlerProps(e);
		if (props) {
			this.isPerformingAction = true;
			this.currentTool!.onActionStart(props);
		}
	};
	private onMouseMove = (e: MouseEvent) => {
		const props = this.makeToolHandlerProps(e);

		if (!props) {
			return;
		}

		if (!this.isPerformingAction) {
			this.currentTool!.onMouseMove(props);
		} else {
			this.currentTool!.onActionMove(props);
		}
	};
	private onMouseUp = (e: MouseEvent) => {
		if (!this.isPerformingAction) return;

		const props = this.makeToolHandlerProps(e);
		if (props) {
			this.currentTool!.onActionEnd(props);
		}
		this.isPerformingAction = false;
	};
}

export default PaintHandler;

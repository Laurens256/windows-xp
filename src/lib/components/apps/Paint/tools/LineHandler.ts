import type {
	BaseToolHandlerPropsFromHandler,
	Point,
	ToolHandler,
	ToolHandlerFnProps,
	ToolHandlerLifecycleFnProps,
} from '../types';
import BaseToolHandler from './BaseToolHandler';
import { ToolId } from '../constants';
import { stylesUtil } from './utils';

class LineHandler extends BaseToolHandler implements ToolHandler {
	private areaStart: Point | null = null;

	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.LINE,
			isSelectionAware: true,
			isCursorSizeAware: true,
			...args,
		});
	}

	onInitialize({ color, cursorSize }: ToolHandlerLifecycleFnProps) {
		stylesUtil.configureShapeStyles({
			layers: [this.previewLayer],
			color,
			cursorSize,
		});
	}

	onActionStart({ toX, toY }: ToolHandlerFnProps) {
		this.areaStart = { x: toX, y: toY };
	}
	onActionMove({ fromX, fromY, toX, toY }: ToolHandlerFnProps) {
		const fromPoint = this.areaStart || { x: fromX, y: fromY };
		const toPoint = { x: toX, y: toY };

		this.clearLayer(this.previewLayer);
		this.previewLayer.beginPath();
		this.previewLayer.moveTo(fromPoint.x, fromPoint.y);
		this.previewLayer.lineTo(toPoint.x, toPoint.y);
		this.previewLayer.stroke();
		this.previewLayer.closePath();
	}
	onActionEnd() {
		this.paintLayer.drawImage(this.previewLayer.canvas, 0, 0);
		this.clearLayer(this.previewLayer);
	}
}

export default LineHandler;

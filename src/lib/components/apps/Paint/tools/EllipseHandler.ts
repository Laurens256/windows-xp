import BaseToolHandler from './BaseToolHandler';
import {
	type BaseToolHandlerPropsFromHandler,
	type Point,
	type ToolHandler,
	type ToolHandlerFnProps,
	type ToolHandlerLifecycleFnProps,
} from '../types';
import { ToolId } from '../constants';
import { stylesUtil } from './utils';

class EllipseHandler extends BaseToolHandler implements ToolHandler {
	private areaStart: Point | null = null;

	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.ELLIPSE,
			isSelectionAware: true,
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

		if (this.previewLayer) {
			this.clearLayer(this.previewLayer);

			this.previewLayer.beginPath();

			const centerX = (fromPoint.x + toPoint.x) / 2;
			const centerY = (fromPoint.y + toPoint.y) / 2;
			const radiusX = Math.abs(toPoint.x - fromPoint.x) / 2;
			const radiusY = Math.abs(toPoint.y - fromPoint.y) / 2;

			this.previewLayer.ellipse(
				centerX,
				centerY,
				radiusX,
				radiusY,
				0, // rotation
				0, // start angle
				2 * Math.PI,
			);

			this.previewLayer.stroke();
		}
	}
	onActionEnd() {
		this.paintLayer.drawImage(this.previewLayer.canvas, 0, 0);
		this.clearLayer(this.previewLayer);
	}
}

export default EllipseHandler;

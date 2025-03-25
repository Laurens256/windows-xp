import BaseToolHandler from './BaseToolHandler';
import {
	type BaseToolHandlerPropsFromHandler,
	type Point,
	type ToolHandler,
	type ToolHandlerFnProps,
	type ToolHandlerLifecycleFnProps,
} from '../types';
import { ToolId } from '../constants';
import { pointUtil, polygonUtil, stylesUtil } from './utils';

class PolygonHandler extends BaseToolHandler implements ToolHandler {
	private points: Point[] = [];

	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.POLYGON,
			isSelectionAware: true,
			isCursorSizeAware: true,
			...args,
		});
	}

	onInitialize({ color, cursorSize }: ToolHandlerLifecycleFnProps) {
		stylesUtil.configureShapeStyles({
			layers: [this.previewLayer, this.mousePreviewLayer],
			color,
			cursorSize,
		});
	}

	onActionStart({ toX, toY }: ToolHandlerFnProps) {
		const point = { x: toX, y: toY };

		const { isClosingPoint, closedPoints } = pointUtil.calculateIsClosingPoint({
			point,
			points: this.points,
		});

		if (isClosingPoint) {
			polygonUtil.drawPolygon({
				ctx: this.previewLayer,
				points: closedPoints,
			});
			this.paintLayer.drawImage(this.previewLayer.canvas, 0, 0);
			this.clearLayer(this.previewLayer);
			this.points = [];
		} else {
			polygonUtil.drawPolygonPoint({
				ctx: this.previewLayer,
				fromPoint: this.points[this.points.length - 1],
				toPoint: point,
			});
			this.points.push(point);
		}
	}

	onMouseMove({ toX, toY }: ToolHandlerFnProps) {
		const lastPoint = this.points[this.points.length - 1];
		this.clearLayer(this.mousePreviewLayer);

		polygonUtil.drawPolygonPoint({
			ctx: this.mousePreviewLayer,
			fromPoint: lastPoint,
			toPoint: { x: toX, y: toY },
		});
	}

	onDestroy() {
		this.clearLayer(this.previewLayer);
	}
}

export default PolygonHandler;

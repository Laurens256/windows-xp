import BaseToolHandler from './BaseToolHandler';
import type { BaseToolHandlerPropsFromHandler, ToolHandler, ToolHandlerFnProps } from '../types';
import { ToolId } from '../constants';
import { pointUtil, polygonUtil, stylesUtil } from './utils';

class FreeSelectHandler extends BaseToolHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.FREE_SELECT,
			isSelectionAware: false,
			...args,
		});
	}

	onInitialize() {
		stylesUtil.configureSelectionStyles([this.selectionLayer, this.previewLayer]);
	}

	onActionStart({ selection, toX, toY }: ToolHandlerFnProps) {
		const point = { x: toX, y: toY };
		let points = selection.points;

		// 	reset selection if prev is already closed
		if (selection.isClosed && points.length) {
			this.clearLayer(this.selectionLayer);
			points = [];
		}

		const { isClosingPoint, closedPoints } = pointUtil.calculateIsClosingPoint({ point, points });

		if (isClosingPoint) {
			this.clearLayer(this.previewLayer);
			polygonUtil.drawPolygon({ ctx: this.selectionLayer, points: closedPoints });
		} else {
			polygonUtil.drawPolygonPoint({
				ctx: this.selectionLayer,
				fromPoint: points[points.length - 1],
				toPoint: point,
			});
		}

		this.makeSelection({
			isClosed: isClosingPoint,
			points: isClosingPoint ? closedPoints : [...points, point],
		});
	}

	onMouseMove({ toX, toY, selection }: ToolHandlerFnProps) {
		if (!selection.isClosed) {
			const lastPoint = selection.points[selection.points.length - 1];
			this.clearLayer(this.previewLayer);

			polygonUtil.drawPolygonPoint({
				ctx: this.previewLayer,
				fromPoint: lastPoint,
				toPoint: { x: toX, y: toY },
			});
		}
	}
}

export default FreeSelectHandler;

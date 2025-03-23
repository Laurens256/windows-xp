import BaseToolHandler from './BaseToolHandler';
import { type BaseToolHandlerPropsFromHandler, type ToolHandler, type ToolHandlerFnProps } from '../types';
import { ToolId } from '../constants';
import { stylesUtil } from './utils';

class RectangleSelectHandler extends BaseToolHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.RECTANGLE_SELECT,
			isSelectionAware: false,
			...args,
		});
	}

	onInitialize() {
		stylesUtil.configureSelectionStyles([this.selectionLayer]);
	}

	onActionStart() {
		this.makeSelection({
			isClosed: false,
			points: [],
		});
		this.clearLayer(this.selectionLayer);
	}
	onActionMove({ fromX, fromY, toX, toY, selection }: ToolHandlerFnProps) {
		const fromPoint = selection.points[0] || { x: fromX, y: fromY };
		const toPoint = { x: toX, y: toY };
		const fromXToY = { x: fromPoint.x, y: toY };
		const toXFromY = { x: toX, y: fromPoint.y };

		this.clearLayer(this.selectionLayer);

		this.selectionLayer.beginPath();
		this.selectionLayer.rect(fromPoint.x, fromPoint.y, toX - fromPoint.x, toY - fromPoint.y);
		this.selectionLayer.stroke();

		this.makeSelection({
			isClosed: true,
			points: [
				fromPoint,
				fromXToY,
				toPoint,
				toXFromY,
			],
		});
	}
}

export default RectangleSelectHandler;

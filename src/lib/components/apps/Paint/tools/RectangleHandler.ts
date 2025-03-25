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

type RectangleHandlerProps = {
	isRounded?: boolean;
};

class RectangleHandler extends BaseToolHandler implements ToolHandler {
	private areaStart: Point | null = null;
	private readonly isRounded: boolean | undefined;

	constructor({ isRounded, ...args }: RectangleHandlerProps & BaseToolHandlerPropsFromHandler) {
		super({
			toolId: isRounded ? ToolId.ROUNDED_RECTANGLE : ToolId.RECTANGLE,
			isSelectionAware: true,
			isCursorSizeAware: true,
			...args,
		});
		this.isRounded = isRounded;
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
		// const fromPoint = this.areaStart || { x: fromX, y: fromY };
		const toPoint = { x: toX, y: toY };

		if (this.previewLayer) {
			this.clearLayer(this.previewLayer);

			const rectArgs = [fromPoint.x, fromPoint.y, toPoint.x - fromPoint.x, toPoint.y - fromPoint.y] as const;

			this.previewLayer.beginPath();
			if (this.isRounded) {
				this.previewLayer.roundRect(...rectArgs, 10);
			} else {
				this.previewLayer.rect(...rectArgs);
			}
			this.previewLayer.stroke();
		}
	}
	onActionEnd() {
		this.paintLayer.drawImage(this.previewLayer.canvas, 0, 0);
		this.clearLayer(this.previewLayer);
	}
}

export default RectangleHandler;

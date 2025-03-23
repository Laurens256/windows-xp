import BaseToolHandler from './BaseToolHandler';
import type { BaseToolHandlerPropsFromHandler, ToolHandler, ToolHandlerFnProps, ToolHandlerLifecycleFnProps } from '../types';
import { ToolId } from '../constants';

class EraserHandler extends BaseToolHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.ERASER,
			isSelectionAware: true,
			...args,
		});
	}

	onInitialize({ cursorSize }: ToolHandlerLifecycleFnProps) {
		this.paintLayer.lineWidth = cursorSize;
		this.paintLayer.globalCompositeOperation = 'destination-out';
	}

	onActionStart({ toX, toY }: ToolHandlerFnProps) {
		this.paintLayer.beginPath();
		this.paintLayer.moveTo(toX, toY);
		this.paintLayer.lineTo(toX, toY);
		this.paintLayer.stroke();
	}

	onActionMove({ fromX, fromY, toX, toY }: ToolHandlerFnProps) {
		this.paintLayer.beginPath();
		this.paintLayer.moveTo(fromX, fromY);
		this.paintLayer.lineTo(toX, toY);
		this.paintLayer.stroke();
	}

	onActionEnd() {
		this.paintLayer.closePath();
	}
}

export default EraserHandler;

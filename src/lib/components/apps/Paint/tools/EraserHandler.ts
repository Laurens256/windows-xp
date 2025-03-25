import BaseToolHandler from './BaseToolHandler';
import type { BaseToolHandlerPropsFromHandler, ToolHandler, ToolHandlerFnProps, ToolHandlerLifecycleFnProps } from '../types';
import { ToolId } from '../constants';

class EraserHandler extends BaseToolHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.ERASER,
			isSelectionAware: true,
			isCursorSizeAware: true,
			...args,
		});
	}

	onInitialize({ cursorSize }: ToolHandlerLifecycleFnProps) {
		this.paintLayer.lineWidth = cursorSize;
		this.paintLayer.globalCompositeOperation = 'destination-out';
		this.paintLayer.lineCap = 'round';
		this.paintLayer.lineJoin = 'round';
	}

	onActionStart({ toX, toY }: ToolHandlerFnProps) {
		this.paintLayer.beginPath();
		this.paintLayer.arc(toX, toY, this.paintLayer.lineWidth / 2, 0, Math.PI * 2);
		this.paintLayer.fill();
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

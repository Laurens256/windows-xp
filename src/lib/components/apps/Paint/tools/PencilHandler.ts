import type { BaseToolHandlerPropsFromHandler, ToolHandler, ToolHandlerFnProps, ToolHandlerLifecycleFnProps } from '../types';
import BaseToolHandler from './BaseToolHandler';
import { ToolId } from '../constants';

class PencilHandler extends BaseToolHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.PENCIL,
			isSelectionAware: true,
			...args,
		});
	}

	onInitialize({ cursorSize, color }: ToolHandlerLifecycleFnProps) {
		this.paintLayer.lineJoin = 'round';
		this.paintLayer.lineCap = 'round';
		this.paintLayer.lineWidth = cursorSize;
		this.paintLayer.strokeStyle = color;
	}

	onActionStart ({ toX, toY }: ToolHandlerFnProps) {
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

	onActionEnd () {
		this.paintLayer.closePath();
	}
}

export default PencilHandler;

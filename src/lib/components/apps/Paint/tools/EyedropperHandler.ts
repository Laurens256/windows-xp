import BaseToolHandler from './BaseToolHandler';
import type { BaseToolHandlerPropsFromHandler, ToolHandler, ToolHandlerFnProps } from '../types';
import { ToolId } from '../constants';

class EyedropperHandler extends BaseToolHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.EYEDROPPER,
			isSelectionAware: false,
			isCursorSizeAware: false,
			withPreviewCursor: true,
			...args,
		});
	}

	onActionStart({ toX, toY }: ToolHandlerFnProps) {
		const pixelData = this.paintLayer.getImageData(toX, toY, 1, 1).data;
		const [r, g, b, a] = pixelData;
		let rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

		const isBgClick = pixelData.every((channel) => channel === 0);
		if (isBgClick) {
			rgba = 'rgba(255, 255, 255, 1)';
		}

		this.setColors(rgba);
	}
}

export default EyedropperHandler;

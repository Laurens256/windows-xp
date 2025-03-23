import { type BaseToolHandlerPropsFromHandler, type ToolHandler } from '../types';
import RectangleHandler from './RectangleHandler';

class RoundedRectangleSelectHandler extends RectangleHandler implements ToolHandler {
	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({ isRounded: true, ...args });
	}
}

export default RoundedRectangleSelectHandler;

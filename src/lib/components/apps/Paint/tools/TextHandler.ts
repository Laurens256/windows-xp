import BaseToolHandler from './BaseToolHandler';
import type {
	BaseToolHandlerPropsFromHandler,
	Point,
	ToolHandler,
	ToolHandlerFnProps,
	ToolHandlerLifecycleFnProps,
} from '../types';
import { ToolId } from '../constants';
import { stylesUtil } from './utils';

const BOX_PADDING = 5;

class TextHandler extends BaseToolHandler implements ToolHandler {
	private textStart: Point | null = null;
	private fontSize = 20;

	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.TEXT,
			isSelectionAware: true,
			...args,
		});
		this.textField.addEventListener('input', this.handleInput as () => void);
	}

	showTextField() {
		this.textField.style.display = 'block';
	}
	hideTextField() {
		this.textField.style.display = 'none';
	}

	onInitialize({ color }: ToolHandlerLifecycleFnProps) {
		stylesUtil.configureTextStyles({
			textLayer: this.paintLayer,
			textField: this.textField,
			fontSize: this.fontSize,
			textBoxPadding: BOX_PADDING,
			color,
		});
	}

	drawText = () => {
		if (!this.textStart) return;

		const { x, y } = this.textStart;
		this.paintLayer.fillText(this.textField.value, x, y);
	};

	drawTextPreview = (value: string) => {
		if (!this.textStart) return;

		const { x, y } = this.textStart;

		const { fontBoundingBoxAscent, fontBoundingBoxDescent, width } = this.paintLayer.measureText(value);
		const height = fontBoundingBoxAscent + fontBoundingBoxDescent;

		const visualX = x - BOX_PADDING;
		const visualY = y - height - BOX_PADDING / 2;
		const visualWidth = width + BOX_PADDING * 2 + 2; // + 2px because canvas style and ctx style don't exactly match (?)
		const visualHeight = height + BOX_PADDING * 2;

		this.textField.style.left = `${visualX}px`;
		this.textField.style.top = `${visualY}px`;
		this.textField.style.width = `${visualWidth}px`;
		this.textField.style.height = `${visualHeight}px`;
	};

	handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
		this.drawTextPreview(e.currentTarget.value);
	};

	onActionStart({ toX, toY }: ToolHandlerFnProps) {
		this.showTextField();
		this.drawText();

		this.textStart = { x: toX, y: toY };
		this.textField.inert = false;
		this.textField.style.left = `${toX}px`;
		this.textField.style.top = `${toY}px`;
		this.textField.value = '';

		this.drawTextPreview(this.textField.value);

		// hacky because onActionStart is called on mouse down so native focus event fires after this
		setTimeout(() => this.textField.focus(), 0);
	}

	onDestroy() {
		this.drawText();
		this.hideTextField();
		this.textField.value = '';
		this.textField.removeEventListener('input', this.handleInput as () => void);
	}
}

export default TextHandler;

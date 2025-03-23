import type {
	BaseToolHandlerPropsFromHandler,
	ToolHandler,
	ToolHandlerFnProps,
	ToolHandlerLifecycleFnProps,
} from '../types';
import BaseToolHandler from './BaseToolHandler';
import { ToolId } from '../constants';

type PixelData = {
	width: number;
	height: number;
	data: Uint32Array;
};
type Span = {
	left: number;
	right: number;
	y: number;
	direction: number;
};

// SOURCE: https://stackoverflow.com/questions/2106995/how-can-i-perform-flood-fill-with-html-canvas/56221940#56221940
function getPixel(pixelData: PixelData, x: number, y: number) {
	if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
		return -1; // impossible color
	} else {
		return pixelData.data[y * pixelData.width + x];
	}
}

class BucketHandler extends BaseToolHandler implements ToolHandler {
	private fillColor: string | undefined;

	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.BUCKET,
			isSelectionAware: false,
			...args,
		});
	}

	private hexToUint32 = (hexColor: string) => {
		this.previewLayer.fillStyle = hexColor;
		this.previewLayer.fillRect(0, 0, 1, 1);
		const imgData = this.previewLayer.getImageData(0, 0, 1, 1);
		this.previewLayer.clearRect(0, 0, 1, 1);

		return new Uint32Array(imgData.data.buffer)[0];
	};

	onInitialize ({ color }: ToolHandlerLifecycleFnProps) {
		this.fillColor = color;
	}

	onActionStart ({ toX, toY }: ToolHandlerFnProps) {
		if (!this.fillColor) {
			return;
		}

		const color32Bit = this.hexToUint32(this.fillColor);

		const imageData = this.paintLayer.getImageData(
			0, 0, this.paintLayer.canvas.width, this.paintLayer.canvas.height,
		);

		const pixelData: PixelData = {
			width: imageData.width,
			height: imageData.height,
			data: new Uint32Array(imageData.data.buffer),
		};

		const targetColor = getPixel(pixelData, toX, toY);

		if (targetColor === color32Bit) {
			return;
		}

		const spansToCheck: Span[] = [];

		function checkSpan({ left, right, y, direction }: Span) {
			let inSpan = false;
			let start = 0;
			let x;
			for (x = left; x < right; ++x) {
				const color = getPixel(pixelData, x, y);
				if (color === targetColor) {
					if (!inSpan) {
						inSpan = true;
						start = x;
					}
				} else {
					if (inSpan) {
						inSpan = false;
						spansToCheck.push({ left: x, right: x - 1, y, direction });
					}
				}
			}

			if (inSpan) {
				spansToCheck.push({ left: start, right: x - 1, y, direction });
			}
		}

		spansToCheck.push({ left: toX, right: toX, y: toY, direction: 0 });

		while (spansToCheck.length > 0) {
			const { left, right, y, direction } = spansToCheck.pop() as Span;

			let l = left;
			for (;;) {
				--l;
				const color = getPixel(pixelData, l, y);
				if (color !== targetColor) {
					break;
				}
			}
			++l;

			let r = right;
			for (;;) {
				++r;
				const color = getPixel(pixelData, r, y);
				if (color !== targetColor) {
					break;
				}
			}

			const lineOffset = y * pixelData.width;
			pixelData.data.fill(color32Bit, lineOffset + l, lineOffset + r);

			if (direction <= 0) {
				checkSpan({ left: l, right: r, y: y - 1, direction: -1 });
			} else {
				checkSpan({ left: l, right: left, y: y - 1, direction: -1 });
				checkSpan({ left: right, right: r, y: y - 1, direction: -1 });
			}

			if (direction >= 0) {
				checkSpan({ left: l, right: r, y: y + 1, direction: +1 });
			} else {
				checkSpan({ left: l, right: left, y: y + 1, direction: +1 });
				checkSpan({ left: right, right: r, y: y + 1, direction: +1 });
			}
		}
		this.paintLayer.putImageData(imageData, 0, 0);
	}
}

export default BucketHandler;

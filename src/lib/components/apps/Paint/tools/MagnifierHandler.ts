import BaseToolHandler from './BaseToolHandler';
import type {
	BaseToolHandlerPropsFromHandler,
	Point,
	ToolHandler,
	ToolHandlerFnProps,
	ToolHandlerLifecycleFnProps,
} from '../types';
import { ToolId } from '../constants';

class MagnifierHandler extends BaseToolHandler implements ToolHandler {
	private zoomLevel = 1.5;
	private zoomAreaSize = 100;

	private prevPoint: Point | null = null;

	constructor(args: BaseToolHandlerPropsFromHandler) {
		super({
			toolId: ToolId.MAGNIFIER,
			isSelectionAware: false,
			isCursorSizeAware: false,
			...args,
		});
	}

	onInitialize({ cursorSize }: ToolHandlerLifecycleFnProps) {
		this.mousePreviewLayer.fillStyle = '#fff';
		this.mousePreviewLayer.strokeStyle = 'rgba(0, 0, 0, 0.6)';
		this.mousePreviewLayer.lineWidth = 2;
		this.zoomLevel = 1 + (cursorSize - 1) * 4 / 24;

		if (this.prevPoint) {
			this.handleMagnifier(this.prevPoint);
		}
	}

	private getSourceRegion(point: Point) {
		const halfSize = this.zoomAreaSize / 2;

		return {
			sourceX: point.x - halfSize / this.zoomLevel,
			sourceY: point.y - halfSize / this.zoomLevel,
			sourceWidth: this.zoomAreaSize / this.zoomLevel,
			sourceHeight: this.zoomAreaSize / this.zoomLevel,
		};
	}

	private drawMagnifiedView(
		sourceRegion: ReturnType<typeof this.getSourceRegion>,
		point: Point,
	) {
		const halfSize = this.zoomAreaSize / 2;

		this.mousePreviewLayer.save();
		this.mousePreviewLayer.beginPath();
		this.mousePreviewLayer.arc(
			point.x,
			point.y,
			halfSize,
			0,
			2 * Math.PI,
		);

		this.mousePreviewLayer.fill();
		this.mousePreviewLayer.stroke();

		this.mousePreviewLayer.clip();

		this.mousePreviewLayer.drawImage(
			this.paintLayer.canvas,
			sourceRegion.sourceX,
			sourceRegion.sourceY,
			sourceRegion.sourceWidth,
			sourceRegion.sourceHeight,
			point.x - halfSize,
			point.y - halfSize,
			this.zoomAreaSize,
			this.zoomAreaSize,
		);

		this.mousePreviewLayer.restore();
	}

	private handleMagnifier = (point: Point) => {
		this.clearLayer(this.mousePreviewLayer);

		const area = this.getSourceRegion(point);

		this.drawMagnifiedView(area, point);

		this.prevPoint = point;
	};

	onMouseMove({ toX, toY }: ToolHandlerFnProps) {
		this.handleMagnifier({ x: toX, y: toY });
	}
}

export default MagnifierHandler;

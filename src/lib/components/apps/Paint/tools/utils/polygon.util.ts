import type { Point } from '../../types';

type DrawPolygonProps = {
	ctx: CanvasRenderingContext2D;
	points: Point[];
};
const drawPolygon = ({ ctx, points }: DrawPolygonProps) => {
	if (points.length) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for (const point of points) {
			ctx.lineTo(point.x, point.y);
		}
		ctx.closePath();
		ctx.stroke();
	}
};

type DrawPolygonPointProps = {
	ctx: CanvasRenderingContext2D;
	fromPoint: Point | undefined;
	toPoint: Point;
};

const drawPolygonPoint = ({ ctx, fromPoint, toPoint }: DrawPolygonPointProps)=> {
	if (fromPoint) {
		ctx.beginPath();
		ctx.moveTo(fromPoint.x, fromPoint.y);
		ctx.lineTo(toPoint.x, toPoint.y);
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.moveTo(toPoint.x, toPoint.y);
	}
};

export {
	drawPolygonPoint,
	drawPolygon,
};

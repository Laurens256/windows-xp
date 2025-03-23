import type { PaintSelection, Point } from '$apps/Paint/types';

type CalculateIsClosingPointProps = {
	point: Point;
	points: Point[];
	distance?: number;
};

type CalculateIsClosingPointReturn = {
	isClosingPoint: true;
	closedPointIndex: number;
	closedPoints: Point[];
} | {
	isClosingPoint: false;
	closedPointIndex: -1;
	closedPoints: never[];
};
const calculateIsClosingPoint = ({
	point, points, distance = 10,
}: CalculateIsClosingPointProps): CalculateIsClosingPointReturn => {
	const closingPointIndex = points.findIndex((p) => {
		const d = Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2));
		return d < distance;
	});

	return {
		isClosingPoint: closingPointIndex !== -1,
		closedPointIndex: closingPointIndex,
		closedPoints: closingPointIndex !== -1
			? [
				...points.slice(closingPointIndex),
				points[closingPointIndex],
			]
			: [],
	} as CalculateIsClosingPointReturn;
};

const createPathFromPoints = (selection: PaintSelection, isSelectionAware = true): Path2D | null => {
	const { points } = selection;

	if (!isSelectionAware || points.length < 3) return null;

	const path = new Path2D();
	path.moveTo(points[0].x, points[0].y);

	for (let i = 1; i < points.length; i++) {
		path.lineTo(points[i].x, points[i].y);
	}

	path.closePath();

	return path;
};

export {
	calculateIsClosingPoint,
	createPathFromPoints,
};

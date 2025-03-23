enum ToolId {
	PENCIL = 'pencil',
	ERASER = 'eraser',
	BUCKET = 'bucket',
	EYEDROPPER = 'eyedropper',
	RECTANGLE_SELECT = 'rectangle-select',
	RECTANGLE = 'rectangle',
	ELLIPSE = 'ellipse',
	ROUNDED_RECTANGLE = 'rounded-rectangle',
	POLYGON = 'polygon',
	FREE_SELECT = 'free-select',
	LINE = 'line',

	// unimplemented
	AIR_BRUSH = 'air-brush',
	BRUSH = 'brush',
	CURVE = 'curve',
	MAGNIFIER = 'magnifier',
	TEXT = 'text', // wip
}

// also defines render order
enum PaintLayerId {
	SELECTION = 'selection',
	MOUSE_PREVIEW = 'mouse-preview',
	PREVIEW = 'preview',
	PAINT = 'paint',
}

export { ToolId, PaintLayerId };

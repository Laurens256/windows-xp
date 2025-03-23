import { ToolId } from '$apps/Paint/constants';
import { PaintIconBucket, PaintIconEllipse, PaintIconEraser, PaintIconEyedropper, PaintIconPencil, PaintIconFreeSelect, PaintIconPolygon, PaintIconRectangle, PaintIconRectangleSelect, PaintIconRoundedRectangle, PaintIconLine, PaintIconText } from './icons';
import {
	BucketHandler,
	EllipseHandler,
	EraserHandler,
	EyedropperHandler,
	PencilHandler,
	FreeSelectHandler,
	PolygonHandler,
	RectangleHandler,
	RectangleSelectHandler,
	LineHandler,
	RoundedRectangleHandler, TextHandler,
} from '../../tools';
import type { BaseToolHandlerPropsFromHandler, ToolHandlerClass } from '../../types';

type ToolEntry = {
	label: string;
	toolId: ToolId;
	handler: ToolHandlerClass<BaseToolHandlerPropsFromHandler>;
	icon: string;
};

const tools: ToolEntry[] = [
	{
		label: 'Free select',
		toolId: ToolId.FREE_SELECT,
		handler: FreeSelectHandler,
		icon: PaintIconFreeSelect,
	},
	{
		label: 'Rectangle select',
		toolId: ToolId.RECTANGLE_SELECT,
		handler: RectangleSelectHandler,
		icon: PaintIconRectangleSelect,
	},
	{
		label: 'Eraser',
		toolId: ToolId.ERASER,
		handler: EraserHandler,
		icon: PaintIconEraser,
	},
	{
		label: 'Bucket',
		toolId: ToolId.BUCKET,
		handler: BucketHandler,
		icon: PaintIconBucket,
	},
	{
		label: 'Eyedropper',
		toolId: ToolId.EYEDROPPER,
		handler: EyedropperHandler,
		icon: PaintIconEyedropper,
	},
	{
		label: 'Pencil',
		toolId: ToolId.PENCIL,
		handler: PencilHandler,
		icon: PaintIconPencil,
	},
	{
		label: 'Text',
		toolId: ToolId.TEXT,
		handler: TextHandler,
		icon: PaintIconText,
	},
	{
		label: 'Line',
		toolId: ToolId.LINE,
		handler: LineHandler,
		icon: PaintIconLine,
	},
	{
		label: 'Rectangle',
		toolId: ToolId.RECTANGLE,
		handler: RectangleHandler,
		icon: PaintIconRectangle,
	},
	{
		label: 'Polygon',
		toolId: ToolId.POLYGON,
		handler: PolygonHandler,
		icon: PaintIconPolygon,
	},
	{
		label: 'Ellipse',
		toolId: ToolId.ELLIPSE,
		handler: EllipseHandler,
		icon: PaintIconEllipse,
	},
	{
		label: 'Rounded rectangle',
		toolId: ToolId.ROUNDED_RECTANGLE,
		handler: RoundedRectangleHandler,
		icon: PaintIconRoundedRectangle,
	},
];

export { tools };

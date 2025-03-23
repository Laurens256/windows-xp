type ConfigureShapeStylesProps = {
	layers: CanvasRenderingContext2D[];
	color: string;
	cursorSize: number;
};
const configureShapeStyles = ({ layers, color, cursorSize }: ConfigureShapeStylesProps) => {
	for (const layer of layers) {
		layer.lineJoin = 'bevel';
		layer.lineCap = 'square';
		layer.lineWidth = cursorSize;
		layer.strokeStyle = color;
	}
};

const configureSelectionStyles = (layers: CanvasRenderingContext2D[]) => {
	for (const layer of layers) {
		const originalStroke = layer.stroke;

		layer.stroke = function() {
			// outer stroke
			this.lineWidth = 3;
			this.strokeStyle = '#fff';
			originalStroke.apply(this);

			// inner stroke
			this.lineWidth = 2;
			this.strokeStyle = '#000';
			originalStroke.apply(this);
		};

		layer.setLineDash([15, 10]);
		layer.lineCap = 'square';
		layer.lineJoin = 'miter';
	}
};

type ConfigureTextStylesProps = {
	textLayer: CanvasRenderingContext2D;
	textField: HTMLElement;
	textBoxPadding: number;
	fontSize: number;
	color: string;
};
const configureTextStyles = ({ textLayer, textField, textBoxPadding, fontSize, color }: ConfigureTextStylesProps) => {
	const font = `400 ${fontSize}px tahoma`;

	textLayer.font = font;
	textLayer.textRendering = 'optimizeLegibility';
	textLayer.fillStyle = color;

	textField.style.font = font;
	textField.style.color = color;
	textField.style.border = `1px solid ${color}`;
	textField.style.padding = `${textBoxPadding}px`;
};

export {
	configureShapeStyles,
	configureSelectionStyles,
	configureTextStyles,
};

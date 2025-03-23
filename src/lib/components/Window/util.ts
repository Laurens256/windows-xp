import type { Size } from '$types';

const DEFAULT_INITIAL_SIZE: Size = { width: 600, height: 400 };
const DEFAULT_MIN_SIZE: Size = { width: 200, height: 150 };

type GetInitialWindowSizeProps = {
	initialSize: Partial<Size> | undefined;
	minSize: Partial<Size> | undefined;
	sizeToContent: boolean | undefined;
};
const getInitialWindowSize = ({
	initialSize,
	minSize,
	sizeToContent,
}: GetInitialWindowSizeProps) => {
	if (sizeToContent) {
		return {
			minSize: { width: 0, height: 0 },
			initialSize: { width: 0, height: 0 },
		};
	}

	const width = initialSize?.width ?? DEFAULT_INITIAL_SIZE.width;
	const minWidth = minSize?.width ?? DEFAULT_MIN_SIZE.width;
	const height = initialSize?.height ?? DEFAULT_INITIAL_SIZE.height;
	const minHeight = minSize?.height ?? DEFAULT_MIN_SIZE.height;

	return {
		minSize: { width: minWidth, height: minHeight },
		initialSize: { width: Math.max(width, minWidth), height: Math.max(height, minHeight) },
	};

	// return {
	// 	width: Math.max(width, minWidth),
	// 	height: Math.max(height, minHeight),
	// };

	// if (sizeToContent) {
	// 	return { width: 0, height: 0 };
	// }
	//
	// const width = initialSize?.width || DEFAULT_INITIAL_SIZE.width;
	// const minWidth = minSize?.width || DEFAULT_MIN_SIZE.width;
	// const height = initialSize?.height || DEFAULT_INITIAL_SIZE.height;
	// const minHeight = minSize?.height || DEFAULT_MIN_SIZE.height;
	//
	// return {
	// 	width: Math.max(width, minWidth),
	// 	height: Math.max(height, minHeight),
	// };
};

export { getInitialWindowSize };

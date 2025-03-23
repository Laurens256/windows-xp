<script lang="ts">
	import type { Position, Size } from '$types';

	type Props = {
		position: Position;
		size: Size;
		minSize: Size;
		setPosition: (position: Partial<Position>) => void;
		setSize: (size: Partial<Size>) => void;
		isMaximized: boolean;
		setIsResizing: (value: boolean) => void;
	};
	let {
		position,
		size,
		setPosition,
		setSize,
		isMaximized,
		minSize,
		setIsResizing,
	}: Props = $props();
	const { width: minWidth, height: minHeight } = minSize;

	type HandleResizeProps = {
		newPosition?: Partial<typeof position>;
		newSize?: Partial<typeof size>;
	};

	const handleResize = ({ newPosition, newSize }: HandleResizeProps) => {
		const finalWidth = Math.max(minWidth, newSize?.width ?? size.width);
		const finalHeight = Math.max(minHeight, newSize?.height ?? size.height);

		const shouldUpdatePositionX = newSize?.width !== undefined && finalWidth > minWidth;
		const shouldUpdatePositionY =
			newSize?.height !== undefined && finalHeight > minHeight;

		setPosition({
			x: shouldUpdatePositionX && newPosition?.x !== undefined
				? newPosition.x
				: position.x,
			y: shouldUpdatePositionY && newPosition?.y !== undefined
				? newPosition.y
				: position.y,
		});

		setSize({
			width: finalWidth,
			height: finalHeight,
		});
	};

	const handleResizeFromTop = (e: MouseEvent) => {
		const { movementY } = e;
		handleResize({
			newPosition: { y: position.y + movementY },
			newSize: { height: size.height - movementY },
		});
	};
	const handleResizeFromRight = (e: MouseEvent) => {
		const { movementX } = e;
		handleResize({ newSize: { width: size.width + movementX } });
	};
	const handleResizeFromBottom = (e: MouseEvent) => {
		const { movementY } = e;
		handleResize({ newSize: { height: size.height + movementY } });
	};
	const handleResizeFromLeft = (e: MouseEvent) => {
		const { movementX } = e;
		handleResize({
			newPosition: { x: position.x + movementX },
			newSize: { width: size.width - movementX },
		});
	};
	const handleResizeFromTopRight = (e: MouseEvent) => {
		const { movementX, movementY } = e;
		handleResize({
			newPosition: { y: position.y + movementY },
			newSize: { width: size.width + movementX, height: size.height - movementY },
		});
	};
	const handleResizeFromBottomRight = (e: MouseEvent) => {
		const { movementX, movementY } = e;
		handleResize({
			newSize: { width: size.width + movementX, height: size.height + movementY },
		});
	};
	const handleResizeFromBottomLeft = (e: MouseEvent) => {
		const { movementX, movementY } = e;
		handleResize({
			newPosition: { x: position.x + movementX },
			newSize: { width: size.width - movementX, height: size.height + movementY },
		});
	};
	const handleResizeFromTopLeft = (e: MouseEvent) => {
		const { movementX, movementY } = e;
		handleResize({
			newPosition: { x: position.x + movementX, y: position.y + movementY },
			newSize: { width: size.width - movementX, height: size.height - movementY },
		});
	};

	const resizeDirections = {
		'top': handleResizeFromTop,
		'right': handleResizeFromRight,
		'bottom': handleResizeFromBottom,
		'left': handleResizeFromLeft,
		'top-right': handleResizeFromTopRight,
		'bottom-right': handleResizeFromBottomRight,
		'bottom-left': handleResizeFromBottomLeft,
		'top-left': handleResizeFromTopLeft,
	} as const;
	const resizeCursors = {
		'top': 'ns-resize',
		'right': 'ew-resize',
		'bottom': 'ns-resize',
		'left': 'ew-resize',
		'top-right': 'nesw-resize',
		'bottom-right': 'nwse-resize',
		'bottom-left': 'nesw-resize',
		'top-left': 'nwse-resize',
	} as const;

	const handleMouseDown = (e: MouseEvent) => {
		const direction = (e.target as HTMLElement).dataset
			.direction as keyof typeof resizeDirections;
		if (!direction) {
			return;
		}

		const handleMouseUp = () => {
			setIsResizing(false);
			document.documentElement.style.removeProperty('--document-cursor');
			window.removeEventListener('mousemove', resizeDirections[direction]);
			window.removeEventListener('mouseup', handleMouseUp);
		};

		setIsResizing(true);
		document.documentElement.style.setProperty('--document-cursor', resizeCursors[direction]);
		window.addEventListener('mousemove', resizeDirections[direction]);
		window.addEventListener('mouseup', handleMouseUp);
	};
</script>

<div
	class="container"
	onmousedown={isMaximized ? undefined : handleMouseDown}
	role="presentation"
	class:active={!isMaximized}
>
	{#each Object.keys(resizeDirections) as direction}
		<span class={direction.split('-').join(' ')} data-direction={direction}></span>
	{/each}
</div>

<style>
	.container {
		--image-size: 10px;
		position: absolute;
		z-index: 2;
		inset: calc(-1 * (var(--image-size) / 2));
		pointer-events: none;

		& > span {
			position: absolute;
			width: var(--image-size);
			height: var(--image-size);
			/* background-color: rgba(0, 0, 0, 0.5); */
		}

		&.active > span {
			pointer-events: all;
		}

		& > :where(.top, .bottom):not(.right, .left) {
			cursor: var(--document-cursor, ns-resize);
			width: 100%;
		}
		& > .top {
			top: 0;
		}
		& > .bottom {
			bottom: 0;
		}

		& > :where(.left, .right):not(.top, .bottom) {
			cursor: var(--document-cursor, ew-resize);
			height: 100%;
		}
		& > .left {
			left: 0;
		}
		& > .right {
			right: 0;
		}

		& > .top.right,
		.bottom.left {
			cursor: var(--document-cursor, nesw-resize);
		}
		& > .top.left,
		.bottom.right {
			cursor: var(--document-cursor, nwse-resize);
		}
	}
</style>

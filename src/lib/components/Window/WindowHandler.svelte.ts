import { type Position, type Size, WindowId } from '$types';
import { onMount, tick } from 'svelte';
import { innerContainerStore, windowStore } from '$stores';
import type { DragBounds } from '@neodrag/svelte';

type Props = {
	initialSize: Size;
	windowId: WindowId;
};

class WindowHandler {
	private readonly windowId: WindowId;

	private sizeBeforeMaximize: Size;
	private positionBeforeMaximize: Position = { x: 0, y: 0 };

	public size: Size = $state({ width: 0, height: 0 });
	public width = $derived(this.size.width);
	public height = $derived(this.size.height);

	public isResizing = $state(false);

	public position: Position = $state({ x: 0, y: 0 });
	public x = $derived(this.position.x);
	public y = $derived(this.position.y);

	private containerSize = $derived(innerContainerStore.size);

	public windowBounds: DragBounds = $derived({
		top: 0,
		bottom: window.innerHeight - this.containerSize.height - this.height + 50,
		left: 0 - this.width + 100,
		right: 0 - this.width + 100,
	});

	public isMaximized = $derived(
		this.width === this.containerSize.width
		&& this.height === this.containerSize.height
		&& this.x === 0
		&& this.y === 0,
	);

	constructor({ initialSize, windowId }: Props) {
		this.size = initialSize;
		this.sizeBeforeMaximize = initialSize;
		this.windowId = windowId;

		onMount(() => {
			const centerWindow = async () => {
				await tick();
				const innerContainer = $state.snapshot(innerContainerStore.element);
				if (innerContainer) {
					const { clientWidth, clientHeight } = innerContainer;
					this.position = {
						x: clientWidth / 2 - this.size.width / 2,
						y: clientHeight / 2 - this.size.height / 2,
					};
				}
			};

			centerWindow();
		});
	}

	setIsResizing = (isResizing: boolean) => {
		this.isResizing = isResizing;
	};

	setPosition = (position: Partial<Position>) => {
		if (position.x) this.position.x = position.x;
		if (position.y) this.position.y = position.y;
	};

	setSize = (size: Partial<Size>) => {
		if (size.width) this.size.width = size.width;
		if (size.height) this.size.height = size.height;
	};

	toggleMaximize = () => {
		if (this.isMaximized) {
			// un-maximize
			this.setSize(this.sizeBeforeMaximize);
			this.position = { ...this.positionBeforeMaximize };
		} else {
			// maximize
			this.sizeBeforeMaximize = { ...this.size };
			this.positionBeforeMaximize = { ...this.position };

			this.setSize({ width: this.containerSize.width, height: this.containerSize.height });
			this.position = { x: 0, y: 0 };
		}
	};

	handleMinimize = () => {
		windowStore.minimizeWindow(this.windowId);
	};
	handleClose = () => {
		windowStore.closeWindow(this.windowId);
	};
	handleFocus = () => {
		windowStore.setFocusedWindow(this.windowId);
	};
}

export default WindowHandler;

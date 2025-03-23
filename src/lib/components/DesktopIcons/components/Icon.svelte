<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridPosition } from '../types';
	import { GRID_ICON_SIZE_PX } from '$app.constants';

	type Props = {
		onOpen: () => void;
		position: GridPosition | null;
		onDrag: () => void;
		setPosition: (position: GridPosition) => void;
		icon: string;
		windowTitle: string;
	};

	let { windowTitle, icon, onOpen, onDrag, position, setPosition }: Props = $props();
	let iconElement = $state<HTMLButtonElement>();

	// let css handle initial automatic positioning
	// update our stored position on mount, then let js take over repositioning
	onMount(() => {
		if (iconElement) {
			const { left, top } = iconElement.getBoundingClientRect();
			const gridCol = Math.round(left / GRID_ICON_SIZE_PX);
			const gridRow = Math.round(top / GRID_ICON_SIZE_PX);

			setPosition({ row: gridRow, col: gridCol });
		}
	});

	const handleOpen = () => {
		iconElement?.blur();
		onOpen();
	};
</script>

<button
	class="button"
	ondblclick={handleOpen}
	onkeyup={(e) => { if (e.key === 'Enter') handleOpen(); }}
	draggable="true"
	ondragstart={onDrag}
	style:grid-area={position && `${position.row + 1} / ${position.col + 1}`}
	bind:this={iconElement}
>
	<img draggable="false" class="icon" src={icon} alt="" />
	<span class="text">{windowTitle}</span>
</button>

<style>
	.button {
		width: var(--icon-size);
		height: var(--icon-size);
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		cursor: default;

		&:focus {
			& .text {
				background-color: #1758a1;
			}
		}
	}
	.icon {
		--image-size: calc(var(--icon-size) * 0.5);
		/* --image-size: calc(var(--icon-size) - 2.75rem); */
		width: var(--image-size);
		height: var(--image-size);
		flex-shrink: 0;
	}
	.text {
		font-family: var(--pixelated-font);
		color: #fff;
		text-shadow: 1px 1px 1px #000;
		font-size: 0.85rem;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-align: center;
	}
</style>

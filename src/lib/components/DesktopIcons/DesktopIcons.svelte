<script lang="ts">
	import { Icon } from './components';
	import type { GridPosition } from './types';
	import { GRID_ICON_SIZE_PX } from '$app.constants';
	import windowsData from '$windowsData';
	import type { WindowId } from '$types';
	import { windowStore } from '$stores';
	import { objectUtil } from '$utils';

	let draggingId: WindowId | null = $state(null);
	const setDraggingId = (id: WindowId | null) => (draggingId = id);

	let iconsPositions = $state(
		Object.fromEntries(
			objectUtil.keys(windowsData).map((id) => [id, null]),
		),
	) as { [k in WindowId]: GridPosition | null };

	const changeIconPosition = (id: WindowId, position: GridPosition) => {
		iconsPositions = {
			...iconsPositions,
			[id]: position,
		};
	};

	const handleDrop = (e: DragEvent) => {
		if (!draggingId) {
			return;
		}
		e.preventDefault();

		const { clientX, clientY } = e;
		const row = Math.floor(clientY / GRID_ICON_SIZE_PX);
		const col = Math.floor(clientX / GRID_ICON_SIZE_PX);

		const occupiedId = objectUtil.keys(iconsPositions).find(
			(id) => iconsPositions[id]?.row === row && iconsPositions[id].col === col,
		);

		if (occupiedId) {
			const oldPosition = iconsPositions[draggingId];
			if (oldPosition) {
				changeIconPosition(occupiedId, oldPosition);
			}
		}

		changeIconPosition(draggingId, { row, col });
		setDraggingId(null);
	};
</script>

<main
	class="container"
	ondrop={handleDrop}
	ondragover={(e) => e.preventDefault()}
>
	{#each objectUtil.entries(windowsData) as [id, windowData] (id)}
		{#if !windowData.hideDesktopEntry}
			<Icon
				{...windowData}
				position={iconsPositions[id]}
				onOpen={() => windowStore.openWindow(id)}
				onDrag={() => setDraggingId(id)}
				setPosition={(position) => changeIconPosition(id, position)}
			/>
		{/if}
	{/each}
</main>

<style>
	.container {
		display: grid;
		height: 100%;
		grid-auto-flow: column;
		grid-template-columns: repeat(auto-fill, var(--icon-size));
		grid-template-rows: repeat(auto-fill, var(--icon-size));
	}
</style>

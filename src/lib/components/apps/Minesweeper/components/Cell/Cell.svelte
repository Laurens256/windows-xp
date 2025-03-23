<script lang="ts">
	import type { CellCoords, CellState } from '../../types';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { SweeperIconMine, SweeperIconFlag, SweeperIconMisFlagged, sweeperIconsNeighbor } from '../../icons';

	type Props = {
		clickedMine: CellCoords | null;
		cellCoords: CellCoords;
	} & HTMLButtonAttributes & CellState;

	const {
		isFlagged, isRevealed, isMine, neighborMines, clickedMine, cellCoords, isChordRevealed, ...rest
	}: Props = $props();

	const isClickedMine = $derived(
		clickedMine
			&& cellCoords.row === clickedMine.row
			&& cellCoords.col === clickedMine.col,
	);

	const getCellProps = () => {
		let ariaLabel = '';
		let imageSource = '';

		const isRevealedMine = isRevealed && isMine;
		const isMisFlaggedMine = !!clickedMine && isFlagged && !isMine;

		if (isRevealedMine) {
			ariaLabel = 'mine';
			imageSource = SweeperIconMine;
		} else if (isMisFlaggedMine) {
			ariaLabel = 'mis-flagged';
			imageSource = SweeperIconMisFlagged;
		} else if (isFlagged) {
			ariaLabel = 'flagged';
			imageSource = SweeperIconFlag;
		} else if (isRevealed) {
			ariaLabel = `${neighborMines} neighboring mines`;
			imageSource = sweeperIconsNeighbor[neighborMines];
		}

		return { ariaLabel, imageSource };
	};

	const { ariaLabel, imageSource } = $derived(getCellProps());
</script>

<button
	class={[
		'cell',
		isRevealed && `neighborMines-${neighborMines}`,
		(isRevealed || isChordRevealed) && 'revealed',
		isFlagged && 'flagged',
		isClickedMine && 'clickedMine',
	]}
	aria-label={ariaLabel}
	{...rest}
>
	{#if imageSource}
		<img src={imageSource} alt="" class="cellImg" />
	{/if}
</button>

<style>
	.cell {
    background-color: #ccc;
    border-top: 3px solid #eee;
    border-left: 3px solid #eee;
    border-right: 3px solid #999;
    border-bottom: 3px solid #999;

		&[disabled] {
			text-shadow: none;
		}

		&.unrevealed {
      background-color: #ccc;
      border-top: 3px solid #eee;
      border-left: 3px solid #eee;
      border-right: 3px solid #999;
      border-bottom: 3px solid #999;
    }

		&.flagged {
      background-color: #ccc;
      border-top: 3px solid #eee;
      border-left: 3px solid #eee;
      border-right: 3px solid #999;
      border-bottom: 3px solid #999;
    }

		&.revealed {
      background-color: #ddd;
      border: 1px solid #999;
			cursor: default;
    }

		&.clickedMine {
			background-color: #fe0000;
		}

    &.neighborMines-1 { color: #0000ff; }
    &.neighborMines-2 { color: #018001; }
    &.neighborMines-3 { color: #fe0000; }
    &.neighborMines-4 { color: #00007d; }
    &.neighborMines-5 { color: #800000; }
    &.neighborMines-6 { color: #027f7e; }
    &.neighborMines-7 { color: #000000; }
    &.neighborMines-8 { color: #808080; }
	}

	.cellImg {
		width: 100%;
		height: 100%;
	}
</style>

<script lang="ts">
	import MinesweeperGame from './MinesweeperGame.svelte';
	import { Cell, GameHeader } from './components';
	import type { Difficulty } from './types';
	import { difficulty } from './constants';
	import HeaderBar from '$components/HeaderBar/HeaderBar.svelte';
	import { type ComponentProps } from 'svelte';

	let chosenDifficulty = $state<Difficulty>(difficulty.BEGINNER);

	const gameHandler = $derived(new MinesweeperGame(chosenDifficulty));

	let isPressingCell = $state(false);

	const headerBarButtons: ComponentProps<typeof HeaderBar>['buttons'] = $derived([
		{
			label: 'Game',
			entries2D: [
				[{
					label: 'New',
					onclick: gameHandler.initGame,
				}],
				Object.values(difficulty).map((entry) => ({
					label: entry,
					leftSection: chosenDifficulty === entry ? '✔' : undefined,
					onclick: () => chosenDifficulty = entry,
				})),
			],
		},
		{ label: 'Help' },
	]);
</script>


<svelte:window
	oncontextmenu={(e) => e.preventDefault()}
/>
<main class="root">
	<HeaderBar buttons={headerBarButtons} />
	<div
		role="presentation"
		class="gameWindow"
		style:--rows={gameHandler.settings.rows}
		style:--cols={gameHandler.settings.cols}
		oncontextmenu={(e) => {
			e.preventDefault();
		}}
	>
		<GameHeader
			minesLeft={gameHandler.minesLeft}
			timer={gameHandler.timer}
			gameState={gameHandler.gameState}
			onReset={gameHandler.initGame}
			{isPressingCell}
		/>

		<div class="gameBoard">
			{#each gameHandler.board as row, rowIndex}
				{#each row as cell, colIndex}
					{@const cellCoords = { row: rowIndex, col: colIndex }}

					<Cell
						{...cell}
						{cellCoords}
						onmousedown={(e) => gameHandler.handleMouseDown(e, cellCoords)}
						onmouseup={gameHandler.handleMouseUp}
						onmouseout={gameHandler.handleMouseOut}
						clickedMine={gameHandler.clickedMine}
					/>
				{/each}
			{/each}
		</div>
	</div>
</main>

<style>
	.root {
		display: flex;
		width: fit-content;
		flex-direction: column;
		align-items: center;

		& :global(img) {
			image-rendering: pixelated;
		}
	}
	.gameWindow {
		width: calc(var(--grid-entry-size) * var(--cols));
		padding: 0.5rem;
		background-color: var(--button-face);
	}
	.gameBoard {
		--grid-entry-size: 2rem;
		display: grid;
		grid-template-columns: repeat(var(--cols), var(--grid-entry-size));
		grid-template-rows: repeat(var(--rows), var(--grid-entry-size));
	}
</style>

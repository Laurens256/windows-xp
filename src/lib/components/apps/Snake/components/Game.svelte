<script lang="ts">
	import SnakeHandler, { type Direction } from '../SnakeHandler.svelte';

	type Props = {
		handler: SnakeHandler;
	};

	let { handler }: Props = $props();

	const WIDTH = 20;
	const HEIGHT = 20;

	const { snake, food, direction, score } = $derived(handler);
	const snakeLength = $derived(score - 1);

	const handleKeyDown = (event: KeyboardEvent) => {
		let dir: Direction | null = null;
		const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

		if (arrowKeys.includes(event.key)) {
			event.preventDefault();
			dir = event.key.slice(5).toLowerCase() as Direction;
			handler.setInputDirection(dir);
		}
	};
</script>

<svelte:window onkeydown={handleKeyDown} />

<main class="board" style:--width={WIDTH} style:--height={HEIGHT}>
	{#each snake as { x, y }, i}
		<div
			class="cell snakeCell"
			class:head={i === 0}
			class:tail={i === snakeLength}
			style:--x={x}
			style:--y={y}
		></div>
	{/each}

	<div class="cell food" style:--x={food.x} style:--y={food.y}></div>
</main>

<style>
	.board {
		--cell-size: 1.25rem;
		--line-thickness: 0.1px;
		--bg-color: #000;
		background-color: var(--bg-color);
		position: relative;
		width: calc((var(--width) + 1) * var(--cell-size));
		height: calc((var(--root-height) + 1) * var(--cell-size));
		border: calc(var(--cell-size) / 2) solid red;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 3;
			background-image: linear-gradient(
				to right,
				var(--bg-color) var(--line-thickness),
				transparent 1px
			),
			linear-gradient(to bottom, var(--bg-color) var(--line-thickness), transparent 1px);
		background-size: var(--cell-size) var(--cell-size);
		outline: 1px solid red;
	}
	}

	.cell {
		position: absolute;
		width: var(--cell-size);
		height: var(--cell-size);
		left: calc(var(--x) * var(--cell-size));
		top: calc(var(--y) * var(--cell-size));
	}

	.snakeCell {
		--outer-radius: 0.25rem;
		background-color: lime;

		&.head {
			z-index: 1;
		}
	}

	.food {
		background-color: red;
	}
</style>

<script lang="ts">
	import SnakeHandler from './SnakeHandler.svelte';
	import { Game } from './components';

	const handler = new SnakeHandler({ width: 20, height: 20 });
	const { isInitialStarted, isGameOver } = $derived(handler);

	const startGame = () => handler.startGame();
</script>

{#if isInitialStarted}
	<Game {handler} />
{:else}
	<div class="overlay">
		<button onclick={startGame}>Start</button>
	</div>
{/if}

<style>
	.overlay {
		position: absolute;
		inset: 0;
	}
</style>

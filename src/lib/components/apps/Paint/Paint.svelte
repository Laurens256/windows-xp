<script lang="ts">
	import { Sidebar, Footer } from './components';
	import PaintHandler from './PaintHandler.svelte';

	const handler = new PaintHandler();
</script>

<div class="root" draggable={false}>
	<Sidebar
		onToolChange={handler.setTool}
		currentTool={handler.currentTool?.toolId}
	/>
	<div bind:this={handler.canvasContainer} class="canvasContainer"></div>
	<Footer
		colors={handler.colors}
		setColors={handler.setColors}
	/>
</div>

<style>
	.root {
		display: grid;
		grid-template-columns: 5rem 1fr;
		grid-template-rows: 1fr auto;
		background-color: var(--surface);
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	.canvasContainer {
    box-shadow: var(--border-sunken-outer), var(--border-sunken-inner);
    background-color: #fff;
    height: 100%;
    overflow: hidden;
    position: relative;
	}
</style>

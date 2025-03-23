<script lang="ts">
	import '$globalStyles/index.css';
	import { Taskbar } from '$components';
	import { innerContainerStore } from '$stores';
	import { GRID_ICON_SIZE_PX } from '$app.constants';

	const { children } = $props();
</script>

<svelte:head>
	<title>Windows XP</title>
</svelte:head>

<div class="container" style:--icon-size={GRID_ICON_SIZE_PX + 'px'}>
	<div class="inner"
		bind:this={innerContainerStore.element}
		bind:offsetWidth={innerContainerStore.width}
		bind:offsetHeight={innerContainerStore.height}
	>
		{@render children()}
	</div>
	<Taskbar />
</div>

<style>
	.container {
		--taskbar-height: 2.5rem;
		position: relative;
		min-width: calc(var(--icon-size) * 5);
	}
	.inner {
		min-height: fit-content;
		height: calc(100vh - var(--taskbar-height));
		background-image: url('/img/xp-bliss.webp');
		background-size: cover;
		background-repeat: no-repeat;
		background-position: top center;
		display: block;
	}
</style>

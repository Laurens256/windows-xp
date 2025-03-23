<script lang="ts">
	import windowsData from '$windowsData';
	import { DesktopIcons, Window } from '$components';
	import { windowStore } from '$stores';
	import { objectUtil } from '$utils';
	import { type WindowChildProps, WindowId } from '$types';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let windows = $derived(windowStore.windows);

	onMount(() => {
		if (!dev) windowStore.openWindow(WindowId.ABOUT);
	});
</script>

<DesktopIcons />
<div class="windowsContainer">
	{#each objectUtil.entries(windows) as [windowId, windowState] (windowId)}
		{@const { component: Component, ...props } = windowsData[windowId]}

		<Window {...windowState} {...props}>
			{#snippet component({ ...props }: WindowChildProps)}
				<Component {...props} />
			{/snippet}
		</Window>
	{/each}
</div>

<style>
	.windowsContainer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}
</style>

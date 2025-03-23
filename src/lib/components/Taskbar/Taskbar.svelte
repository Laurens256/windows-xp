<script lang="ts">
	import { Clock, XpLogo } from './components';
	import { windowStore } from '$stores';
	import windowsData from '$windowsData';
	import { slide } from 'svelte/transition';
</script>

<footer class="taskbar">
	<button class="startButton">
		<XpLogo />
		start
	</button>

	<ul class="windowsList">
		{#each Object.values(windowStore.windows) as { windowId } (windowId)}
			{@const staticWindowData = windowsData[windowId]}

			<li class="listItem" transition:slide={{ duration: 100 }}>
				<button class="taskbarApp" onclick={() => windowStore.toggleWindowMinimize(windowId)}>
					<img src={staticWindowData.icon} alt="" class="appIcon">
					{staticWindowData.windowTitle}
				</button>
			</li>
		{/each}
	</ul>

	<Clock />
</footer>

<style>
	.taskbar {
		position: fixed;
		inset: auto 0 0 0;
		height: var(--taskbar-height);
		font-family: var(--pixelated-font);
		background: linear-gradient(
				to bottom,
				#245edc 0%,
				#3f8cf3 10%,
				#245edc 20%,
				#245edc 85%,
				#1b43ab 100%
		) center / cover no-repeat;
		width: 100%;
		color: #fff;
		display: flex;
		align-items: center;
	}

  .startButton {
    border-radius: 0 0.6rem 0.5rem 0 / 0 50% 50% 0;
    font-size: 1.375rem;
    font-weight: bold;
    font-style: italic;
    background: #47aa48 linear-gradient(
        to bottom,
        hsl(114, 35%, 66%) 0%,
        hsl(120, 42%, 64%) 10%,
        hsl(121, 41%, 47%) 20%,
        hsl(121, 41%, 47%) 100%
    ) no-repeat center;
    box-shadow: 2px -2px 8px rgba(0, 0, 0, 0.5) inset, -1px -2px 8px rgba(0, 0, 0, 0.5) inset;
    padding-inline: 0.8rem 1.5rem;
    text-shadow: 2px 2px 3px #333;
    height: 100%;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    white-space: nowrap;
    font-family: var(--fallback-font);
  }

	.windowsList {
		display: flex;
		height: 100%;
		align-items: flex-end;
		padding-bottom: 0.25rem;
		margin-inline: 0.25rem;
		gap: 0.25rem;
	}
	.listItem {
		height: 75%;
		min-width: 10rem;
	}

	.taskbarApp {
		background-size: 100% 2px;
		box-shadow: inset 2px 1px 1px 0 rgba(255, 255, 255, 0.25);
		background: #3a7ff5 linear-gradient(to right, #6ba1ff, #6ba1ff 10%, #3a7ff5 30%) no-repeat;
		display: flex;
		height: 100%;
		width: 100%;
		padding-inline: 0.5rem;
		border-radius: 0.15rem;
		gap: 0.4rem;
		align-items: center;
		font-size: 0.8rem;
		transition: background-color 0.1s ease;

		&:hover, &:focus-visible {
			background-color: #4589ff;
		}

		& .appIcon {
			height: 80%;
		}
	}
</style>

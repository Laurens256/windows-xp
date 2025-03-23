<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type DropdownEntry = {
		label: string;
		leftSection?: string;
		rightSection?: string;
	} & HTMLButtonAttributes;

	type Props = {
		buttons: {
			label: string;
			entries2D?: DropdownEntry[][];
		}[];
	};

	const { buttons }: Props = $props();

	let activeButtonIndex = $state<number | null>(null);

	const handleOutsideClick = () => {
		activeButtonIndex = null;
	};

	const setActiveMenu = (buttonIndex: number) => {
		if (activeButtonIndex === buttonIndex) {
			activeButtonIndex = null;
		} else {
			activeButtonIndex = buttonIndex;
		}
	};

	$effect(() => {
		if (activeButtonIndex !== null) {
			document.body.addEventListener('click', handleOutsideClick);
		}
		return () => {
			if (activeButtonIndex === null) {
				document.body.removeEventListener('click', handleOutsideClick);
			}
		};
	});
</script>

<header class="root">
	{#each buttons as { label, entries2D }, buttonIndex}
		<div
			class="buttonWrapper"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<button
				class="button"
				class:active={activeButtonIndex === buttonIndex}
				disabled={!entries2D?.length}
				onclick={() => setActiveMenu(buttonIndex)}
			>
				{label}
			</button>

			{#if entries2D}
				<ul
					class="entriesList"
					class:open={activeButtonIndex === buttonIndex}
				>
					{#each entries2D as entries, entriesIndex}
						{#each entries as {
							label,
							leftSection,
							rightSection,
							onclick,
							...rest
						}}
							<li>
								<button class="entry" {...rest}
									onclick={(e) => {
										if (onclick) onclick(e);
										activeButtonIndex = null;
									}}
								>
									<span class="leftSectionWrapper">
										<span class="leftSection">{leftSection}</span>
										{label}
									</span>
									{#if rightSection}
										<span>{rightSection}</span>
									{/if}
								</button>
							</li>
						{/each}

						{#if entriesIndex !== entries2D.length - 1}
							<li role="presentation" class="divider"></li>
						{/if}
					{/each}
				</ul>
			{/if}
		</div>
	{/each}
</header>

<style>
  .root {
    height: 2rem;
    background-color: var(--surface);
    display: flex;
    border-bottom: 1px solid #222;
		width: 100%;
  }
	.buttonWrapper {
		position: relative;
    flex-shrink: 0;
	}
  .button {
    background-color: var(--surface);
    padding-inline: 0.5rem;
    font-family: var(--pixelated-font);
    color: #000;
    font-size: 0.75rem;
		height: 100%;

		&[disabled] {
			text-shadow: none;
		}

		&:not(:disabled):where(:hover, :focus-visible, .active) {
			background-color: var(--dialog-blue);
			color: #fff;
		}
  }

	.entriesList {
		position: fixed;
		background-color: #fff;
		padding: 0.2rem;
		flex-direction: column;
		width: 10rem;
		z-index: 901;
		display: none;
		box-shadow: var(--border-sunken-inner);

		&.open {
			display: flex;
		}
	}
	.entry {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding-block: 0.2rem;
		text-align: start;

		&:hover, &:focus-visible {
			color: #fff;
			background-color: var(--dialog-blue);
		}
	}
	.leftSectionWrapper {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.leftSection {
		display: inline-block;
		width: 0.75rem;
		flex-shrink: 0;
	}
	.divider {
		margin-block: 0.25rem;
		height: 1px;
		background-color: var(--button-shadow);
	}
</style>

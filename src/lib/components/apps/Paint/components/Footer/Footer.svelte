<script lang="ts">
	import { presetColors } from './constants';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ColorButtonProps = {
		color: string;
		isChosenColor?: boolean;
	} & HTMLButtonAttributes;
	type Props = {
		colors: [string, string];
		setColors: (color: string | [string, string], index?: 0 | 1) => void;
	};

	const { colors, setColors }: Props = $props();

	const switchColors = () => {
		setColors([colors[1], colors[0]]);
	};
</script>

<footer class="root">
	{#snippet colorButton({ color, isChosenColor, ...rest }: ColorButtonProps)}
		<button
			class="colorButton"
			class:chosenColor={isChosenColor}
			style:--color={color}
			aria-label={rest['aria-label']}
			{...rest}
		></button>
	{/snippet}

	<div class="selectedColorsContainer">
		<!--TODO onclick color picker (?)-->
		{@render colorButton({
			isChosenColor: true,
			color: colors[0],
			'aria-label': `change primary color from ${colors[0]}`,
		})}

		{@render colorButton({
			onclick: switchColors,
			isChosenColor: true,
			color: colors[1],
			'aria-label': 'swap primary and secondary color',
		})}
	</div>

	<div class="presetColors">
		{#each presetColors as color}
			{@render colorButton({
				onclick: () => setColors(color),
				color: color,
				'aria-label': `set ${color} as primary color`,
			})}
		{/each}
	</div>
</footer>

<style>
  .root {
    --root-height: 3.5rem;
		--root-gap: 0.25rem;
		--padding-block: 0.5rem;
		height: calc(var(--root-height) + var(--padding-block) * 2 + var(--scrollbar-size));
		padding-bottom: 4rem;
		padding-block: var(--padding-block);
		display: flex;
		gap: var(--root-gap);
    grid-column: 1 / -1;
		padding-inline: 0.1rem;
  }
  .colorButton {
		background-color: var(--color);
		width: var(--image-size);
		height: var(--image-size);
    box-shadow: var(--border-sunken-outer);
  }

  .selectedColorsContainer {
    --image-size: 1.5rem;
    --container-padding: 0.25rem;
    --overlap-percent: 20;
    --color-offset: calc(var(--container-padding) + var(--image-size) / 100 * var(--overlap-percent));
		height: var(--root-height);
		width: var(--root-height);
		position: relative;
		flex-shrink: 0;
		box-shadow: var(--border-sunken-outer);

  }
  .chosenColor {
    position: absolute;
		box-shadow: none;
		border: 1px solid var(--surface);

    &:first-child {
      z-index: 1;
      top: var(--color-offset);
      left: var(--color-offset);
    }
    &:last-child {
      bottom: var(--color-offset);
      right: var(--color-offset);
    }
  }

  .presetColors {
    --image-size: calc(var(--root-height) / 2 - var(--root-gap) / 2);
		height: 100%;
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(2, min-content);
		gap: var(--root-gap);
		flex-shrink: 0;
		overflow-x: auto;
		max-width: 100%;
		max-width: calc(100% - var(--root-height));
  }
</style>

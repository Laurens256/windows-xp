<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		label: string;
		color?: 'red' | 'blue';
		span?: number;
	} & HTMLButtonAttributes;

	const { label, color = 'blue', span = 2, ...rest }: Props = $props();
</script>

<button
	type="button"
	{...rest}
	class="button xp"
	style:--colspan={span}
	style:color={color}
>
	{label}
</button>

<style>
	.button {
		padding: 0.375rem 0;
		min-width: fit-content;
		grid-column: span var(--colspan);
	}
</style>

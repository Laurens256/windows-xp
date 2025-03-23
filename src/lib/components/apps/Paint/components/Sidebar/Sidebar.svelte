<script lang="ts">
	import type { BaseToolHandlerPropsFromHandler, ToolHandlerClass } from '../../types';
	import { ToolId } from '../../constants';
	import { tools } from './constants';

	type Props = {
		onToolChange: (newTool: ToolHandlerClass<BaseToolHandlerPropsFromHandler>) => void;
		currentTool: ToolId | undefined;
	};

	const {
		onToolChange,
		currentTool,
	}: Props = $props();
</script>

<aside class="root">
	{#each tools as { label, toolId, handler, icon } (toolId)}
		<button
			title={label}
			onclick={() => onToolChange(handler)}
			class="button"
			class:active={toolId === currentTool}
			aria-label="select {label} tool"
		>
			<img src={icon} alt={label} draggable={false} />
		</button>
	{/each}
</aside>

<style>
	.root {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: min-content;
		gap: 0.2rem;
		padding-inline: 0.2rem;
		overflow-y: auto;
	}
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.2rem;
		padding: 0.2rem;
		border: 1px solid transparent;
		height: fit-content;
		user-select: none;

		&.active {
			border-color: var(--dialog-blue-light);
			background-color: #fff;
		}
	}
</style>

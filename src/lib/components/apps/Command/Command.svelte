<script lang="ts">
	import { tick } from 'svelte';
	import commandStore from './commandStore.svelte';
	import { CommandOutput } from './components';

	const LINE_PREFIX = 'C:\\WINDOWS\\system32> ';

	let containerElement = $state<HTMLPreElement>();
	let inputElement = $state<HTMLTextAreaElement>();
	let inputCloneHeight = $state(0);

	const scrollToBottom = () => {
		if (containerElement) {
			containerElement.scrollTop = containerElement.scrollHeight;
		}
	};

	const inputValue = $derived(commandStore.inputValue);
	const commandHistory = $derived(commandStore.commandHistory);

	const onContainerMouseUp = () => {
		// check if text is selected so we don't focus the textarea when selecting text
		const hasTextSelected = !!document.getSelection()?.toString().length;
		if (!hasTextSelected) {
			inputElement?.focus();
		}
	};

	const handleKeyDown = async (e: KeyboardEvent) => {
		const { key } = e;
		const specialKeys = ['Enter', 'ArrowUp', 'ArrowDown'];

		if (!specialKeys.includes(key)) return;

		e.preventDefault();

		switch (key) {
			case 'Enter':
				commandStore.handleCommandEnter();
				await tick();
				scrollToBottom();
				break;
			case 'ArrowUp':
				commandStore.handleArrowUp();
				break;
			case 'ArrowDown':
				commandStore.handleArrowDown();
				break;
			default:
				break;
		}
	};
</script>

<!-- eslint-disable @stylistic/max-len (gotta love pre tag formatting) -->
<pre
	role="presentation"
	class="container"
	onmouseup={onContainerMouseUp}
	style:--line-prefix-length="{LINE_PREFIX.length}ch"
	bind:this={containerElement}
>
Microsoft Windows XP [Version 5.1.2600]
(C) Copyright 1985-2001 Microsoft Corp.

{#each commandHistory as command}{LINE_PREFIX}{command}<CommandOutput fullCommand={command} />{/each}<div class="inputContainer"><span>{LINE_PREFIX}</span><textarea
	onkeydown={handleKeyDown}
	spellcheck="false"
	class="pre textarea"
	autocapitalize="off"
	bind:this={inputElement}
	style:height="{inputCloneHeight}px"
	bind:value={commandStore.inputValue}
	placeholder={commandHistory.length ? '' : 'help'}
	aria-label="command line"
		></textarea><div
	class="pre textarea clone"
	bind:clientHeight={inputCloneHeight}
	inert>{#if inputValue}{inputValue}{:else}&nbsp;{/if}</div></div></pre>

<style>
	.container {
		height: 100%;
		width: 100%;
		white-space: pre-wrap;
		cursor: text;
		overflow-y: auto;
	}

	.inputContainer {
		position: relative;

		& > span {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
			white-space: nowrap;
		}
	}

	.textarea {
		padding: 0;
		width: 100%;
		text-indent: var(--line-prefix-length);
		font: inherit;
		word-break: break-all;
		caret-shape: block;

		&.clone {
			top: 0;
			position: absolute;
			visibility: hidden;
			pointer-events: none;
		}
	}
</style>

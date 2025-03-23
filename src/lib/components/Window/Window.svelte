<script lang="ts">
	import { draggable, type DragEventData } from '@neodrag/svelte';
	import { Resize, Error } from './components';
	import type { Props } from './types';
	import { fade } from 'svelte/transition';
	import WindowHandler from './WindowHandler.svelte';
	import { getInitialWindowSize } from './util';

	let {
		windowId,
		isMinimized,
		isFocused,
		zIndex,
		icon,
		windowTitle,
		initialSize: initialSizeParam,
		minSize: minSizeParam,
		sizeToContent,
		noActionButtons,
		notMoveable,
		notResizable: _notResizable,
		noMinimize,
		noMaximize,
		noClose,
		component,
	}: Props = $props();

	const { minSize, initialSize } = getInitialWindowSize({
		minSize: minSizeParam,
		initialSize: initialSizeParam,
		sizeToContent
	})

	const notResizable = $derived(_notResizable || sizeToContent);

	const handler = new WindowHandler({ initialSize, windowId });

	const handleDragEnd = ({ offsetX, offsetY }: DragEventData) => {
		handler.setPosition({ x: offsetX, y: offsetY })
	};
</script>

<article
	class="window"
	class:minimized={isMinimized}
	onfocusin={isFocused ? null : handler.handleFocus}
	onmousedown={isFocused ? null : handler.handleFocus}
	use:draggable={{
		handle: '.__drag_handle__',
		cancel: '.title-bar-controls',
		disabled: notMoveable,
		bounds: handler.windowBounds,
		onDragEnd: handleDragEnd,
		position: handler.position,
		legacyTranslate: false,
	}}
	style:z-index={zIndex}
	style:width={sizeToContent ? 'fit-content' : `${handler.width}px`}
	style:height={sizeToContent ? 'fit-content' : `${handler.height}px`}
	bind:offsetWidth={handler.size.width}
	bind:offsetHeight={handler.size.height}
	role="presentation"
	inert={isMinimized}
	aria-labelledby={`__${windowId}_title__`}
	in:fade={{ duration: 50 }}
	out:fade={{ duration: 75 }}
>
	<header
		class="header title-bar"
		class:__drag_handle__={!notMoveable}
		role="presentation"
		ondblclick={noActionButtons || noMaximize || notResizable ? null : handler.toggleMaximize}
		class:maximized={handler.isMaximized}
	>
		<div class="title-bar-icon-text">
			<img class="title-bar-icon" src={icon} alt="" />
			<h2 class="title-bar-text" id={`__${windowId}_title__`}>{windowTitle}</h2>
		</div>
		{#if !noActionButtons}
			<div class="title-bar-controls __cancel_drag_handle__">
				{#if !noMinimize && !notResizable}
					<button
						aria-label="Minimize"
						onclick={handler.handleMinimize}
					></button>
				{/if}
				{#if !noMaximize && !notResizable}
					<button
						aria-label={handler.isMaximized ? 'Restore' : 'Maximize'}
						onclick={handler.toggleMaximize}
					></button>
				{/if}
				{#if !noClose}
					<button aria-label="Close" onclick={handler.handleClose}
					></button>
				{/if}
			</div>
		{/if}
	</header>
	<section class="content" class:isResizing={handler.isResizing}>
		<svelte:boundary>
			{@render component({ setWindowSize: handler.setSize })}

			{#snippet failed(error, reset)}
				<Error {error} {reset} />
			{/snippet}
		</svelte:boundary>
	</section>

	{#if !notResizable}
		<Resize
			position={handler.position}
			size={handler.size}
			setPosition={handler.setPosition}
			setSize={handler.setSize}
			isMaximized={handler.isMaximized}
			setIsResizing={handler.setIsResizing}
			{minSize}
		/>
	{/if}
</article>

<style>
	.window {
		--header-bar-height: 2rem;
		position: absolute;
		pointer-events: auto;
		transition: scale 0.15s ease;

		&.minimized {
			scale: 0;
		}
	}
	.header {
		height: var(--header-bar-height);

		&.__drag_handle__:active {
			cursor: all-scroll;
		}
		&.maximized {
			border-radius: 0;
		}

		& .title-bar-text {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 0.5rem;
		}
	}
	.content {
		height: calc(100% - var(--header-bar-height));
		overflow: auto;
		position: relative;

		&.isResizing {
			pointer-events: none;
			user-select: none;
		}
	}
</style>

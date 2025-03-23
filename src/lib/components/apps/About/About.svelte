<script lang="ts">
	import HeaderBar from '$components/HeaderBar/HeaderBar.svelte';
	import type { ComponentProps } from 'svelte';
	import { fileUtil } from '$utils';
	import { windowStore } from '$stores';
	import { WindowId } from '$types';

	const handleDownloadFile = () => {
		const blob = new Blob([textValue], { type: 'text/plain' });
		fileUtil.downloadFile({ blob, filename: 'about.txt' });
	};

	const buttons: ComponentProps<typeof HeaderBar>['buttons'] = [
		{
			label: 'File',
			entries2D: [
				[
					{ label: 'New', onclick: () => textValue = '' },
					{ label: 'Save as...', onclick: handleDownloadFile },
				],
				[{ label: 'Exit', onclick: () => windowStore.closeWindow(WindowId.ABOUT) }]],
		},
		{ label: 'Edit' },
		{ label: 'Format' },
		{ label: 'View' },
		{ label: 'Help' },
	];

	const calculateYears = (from: string) => {
		const birthDate = new Date(from);
		const today = new Date();

		let age = today.getFullYear() - birthDate.getFullYear();

		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}

		return age;
	};

	let textValue = $state(
		`Hi! My name is Laurens. I'm a ${calculateYears('2003-09-22')} year old web-developer.
The website you're looking at is a side project I made for funsies.

This website works best when using a mouse.

- Double-click the programs on the desktop to open them
- Most windows can be resized and moved around
- Each program has different interactions, so feel free to play around :3`,
	);
</script>

<article class="container">
	<HeaderBar {buttons} />
	<textarea class="textarea" bind:value={textValue}></textarea>
</article>

<style>
  .container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .textarea {
    padding: var(--window-padding-inner);
    font-size: 1rem;
    resize: none;
    overflow-y: scroll;
    font-family: var(--tahoma-font), var(--fallback-font);
    flex-grow: 1;
  }
</style>

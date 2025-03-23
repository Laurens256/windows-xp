<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const handleButtonClick = () => {
		goto('/');
	};
</script>

<div class="root">
	<div class="window">
		<header class="title-bar">
			<h1 class="title-bar-text">Error</h1>

			<div class="title-bar-controls">
				<button aria-label="Close" onclick={handleButtonClick}></button>
			</div>
		</header>

		<div class="window-body">
			<p>{page.error?.message}</p>

			<section class="field-row">
				<button class="xp" onclick={handleButtonClick}>OK</button>
				<button class="xp" onclick={handleButtonClick}>Cancel</button>
			</section>
		</div>
	</div>
</div>

<style>
	.root {
		display: flex;
		justify-content: center;
		padding-top: min(30vh, 20rem);
	}
	.window {
    --header-bar-height: 2rem;
		width: min(20rem, 90vw);
	}
	.title-bar {
		height: var(--header-bar-height);
	}
	.field-row {
		justify-content: flex-end;
	}
	.window-body {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

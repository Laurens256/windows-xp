<script lang="ts">
	type Props = {
		error: unknown;
		reset: () => void;
	};

	const { error, reset }: Props = $props();

	console.error(error);
</script>

<div class="root">
	<div class="textContainer">
		<h3>Something went wrong</h3>
		<p>{error}</p>
	</div>

	<button onclick={reset}>
		Click here to retry
	</button>
</div>

<style>
	.root {
		display: flex;
		justify-content: center;;
		align-items: center;
		height: 100%;
		flex-direction: column;
		gap: 2rem;
	}

	.textContainer {
		display: flex;
		flex-direction: column;
		text-align: center;
		max-width: 20rem;
	}
</style>

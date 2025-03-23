<script lang="ts">

	const TIME_FORMAT = {
		hour: '2-digit',
		minute: '2-digit',
	} as const;

	let time = $state(new Date().toLocaleTimeString('nl-NL', TIME_FORMAT));
	let timeInterval: ReturnType<typeof setInterval>;

	const updateTime = () => time = new Date().toLocaleTimeString(navigator.languages, TIME_FORMAT);

	$effect.pre(() => {
		updateTime();
		timeInterval = setInterval(updateTime, 1000);

		return () => {
			clearInterval(timeInterval);
		};
	});
</script>

<p class="clock">{time}</p>

<style>
	.clock {
		background-color: #068ae8;
		background: linear-gradient(
		to bottom,
		hsl(198, 70%, 66%) 0%,
		hsl(204, 77%, 64%) 10%,
		hsl(205, 95%, 47%) 20%,
		hsl(205, 95%, 47%) 100%
		);
		display: flex;
		height: 100%;
		align-items: center;
		padding-inline: 1.5rem;
		margin-left: auto;
		font-family: var(--pixelated-font);
		text-shadow: var(--small-text-shadow);
		box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.5) inset, -1px -1px 8px rgba(0, 0, 0, 0.5) inset;
	}
</style>

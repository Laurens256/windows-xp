<script lang="ts">
	import type { CommandOutputComponentProps } from '../types';

	const { commandArgs = ' ' }: CommandOutputComponentProps = $props();
</script>

<p class="text">{commandArgs}</p>

<style>
	.text {
		word-break: break-all;
	}
</style>

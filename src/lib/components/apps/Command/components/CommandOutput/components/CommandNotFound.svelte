<script lang="ts">
	import { CommandKey } from '../../../types';
	import type { CommandOutputComponentProps } from '../types';

	// SOURCE https://gist.github.com/andrei-m/982927?permalink_comment_id=2059365#gistcomment-2059365
	function levenshtein(a: string, b: string) {
		let tmp;
		if (a.length === 0) { return b.length; }
		if (b.length === 0) { return a.length; }
		if (a.length > b.length) { tmp = a; a = b; b = tmp; }

		let i, j, res, alen = a.length, blen = b.length, row = Array(alen);
		for (i = 0; i <= alen; i++) { row[i] = i; }

		for (i = 1; i <= blen; i++) {
			res = i;
			for (j = 1; j <= alen; j++) {
				tmp = row[j - 1];
				row[j - 1] = res;
				res = b[i - 1] === a[j - 1] ? tmp : Math.min(tmp + 1, Math.min(res + 1, row[j] + 1));
			}
			row[j - 1] = res;
		}
		return res;
	}

	const { command }: CommandOutputComponentProps = $props();

	const closeCommands = Object.values(CommandKey).reduce((acc, cmd) => {
		const distance = levenshtein(cmd, command);
		if (distance < 3) {
			acc += `\n  ${cmd}`;
		}
		return acc;
	}, '');
</script>

{#if command}
	<p>Command '{command}' not found{#if closeCommands.length}, did you mean:{closeCommands}{/if}</p>
{:else}
	<div aria-hidden="true" role="presentation"></div>
{/if}

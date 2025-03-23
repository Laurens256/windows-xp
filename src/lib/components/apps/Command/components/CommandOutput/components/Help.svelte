<script lang="ts">
	import { CommandKey } from '../../../types';

	const commandsToList: { command: CommandKey; description: string; }[] = [
		{
			command: CommandKey.HELP,
			description: 'List available commands',
		}, {
			command: CommandKey.CLEAR,
			description: 'Clear the command line',
		}, {
			command: CommandKey.DOWNLOAD_RESUME,
			description: 'Download my resume',
		}, {
			command: CommandKey.ECHO,
			description: 'Print a message',
		},
	];
</script>

<ul>
	{#each commandsToList as { command, description }}
		<li>{`  ${command}: ${description}`}</li>
	{/each}
</ul>

<script lang="ts">
	import { CommandNotFound } from './components';
	import { commandToComponentMap } from './constants';
	import type { CommandKey } from '../../types';

	type Props = {
		fullCommand: string;
	};

	const { fullCommand }: Props = $props();

	const [command, commandArgs] = fullCommand.split(/ (.*)/s) as [string, string | undefined];
	const Component = commandToComponentMap[command as CommandKey] || CommandNotFound;
</script>

<Component {command} {commandArgs} />

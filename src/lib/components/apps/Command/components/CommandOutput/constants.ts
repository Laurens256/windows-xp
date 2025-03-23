import { type Component } from 'svelte';
import { CommandKey } from '../../types';
import { Echo, Help, DownloadResume } from './components';
import type { CommandOutputComponentProps } from './types';
import commandStore from '../../commandStore.svelte';

type CommandToComponentMap = Record<CommandKey,
Component
| Component<CommandOutputComponentProps>
| (() => void)
>;

const commandToComponentMap: CommandToComponentMap = {
	[CommandKey.HELP]: Help,
	[CommandKey.ECHO]: Echo,
	[CommandKey.CLEAR]: commandStore.clearCommandHistory,
	[CommandKey.DOWNLOAD_RESUME]: DownloadResume,
};

export { commandToComponentMap };

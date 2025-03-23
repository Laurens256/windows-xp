import { tick } from 'svelte';

const INITIAL_COMMAND_INDEX = -1;

let inputValue = $state('');
let currentCommandIndex = $state(INITIAL_COMMAND_INDEX);
let commandHistory = $state<string[]>([]);

const sessionCommandHistory: string[] = [];
let commandBeforeArrowNavigation = '';

export default {
	get inputValue() {
		return inputValue;
	},
	set inputValue(newValue) {
		inputValue = newValue;
	},
	get currentCommandIndex() {
		return currentCommandIndex;
	},
	get commandHistory() {
		return commandHistory;
	},
	async clearCommandHistory() {
		await tick();
		commandHistory = [];
	},
	handleCommandEnter () {
		const value = inputValue.trim();

		if (sessionCommandHistory[0] !== value && value) {
			sessionCommandHistory.unshift(value);
		}
		currentCommandIndex = INITIAL_COMMAND_INDEX;
		inputValue = '';
		commandBeforeArrowNavigation = '';
		commandHistory.push(value);
	},
	handleArrowUp () {
		if (currentCommandIndex === INITIAL_COMMAND_INDEX && sessionCommandHistory.length) {
			commandBeforeArrowNavigation = inputValue;
		}
		currentCommandIndex = Math.min(
			currentCommandIndex + 1,
			sessionCommandHistory.length - 1,
		);
		if (currentCommandIndex !== INITIAL_COMMAND_INDEX) {
			inputValue = sessionCommandHistory[currentCommandIndex];
		}
	},
	handleArrowDown () {
		currentCommandIndex = Math.max(
			currentCommandIndex - 1,
			INITIAL_COMMAND_INDEX,
		);
		inputValue = currentCommandIndex === INITIAL_COMMAND_INDEX
			? commandBeforeArrowNavigation
			: sessionCommandHistory[currentCommandIndex];
	},
};

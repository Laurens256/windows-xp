<script lang="ts">
	import { Button } from './components';
	import { parseExpression } from './util';

	let currentInput = $state('');
	let memory = $state(0);
	let waitingForOperand = $state(false);

	const clearEntry = () => {
		const lastNumber = currentInput.match(/(\d+\.?\d*)$/);
		if (lastNumber) {
			currentInput = currentInput.slice(0, -lastNumber[0].length);
		}
	};
	const clear = () => {
		currentInput = '';
	};

	const addToEquation = (value: string | number) => {
		if (waitingForOperand && typeof value === 'number') {
			currentInput = String(value);
		} else {
			currentInput += value;
		}
		waitingForOperand = false;
	};

	const backSpace = () => {
		currentInput = currentInput.slice(0, -1);
	};

	const calculate = (e: SubmitEvent) => {
		e.preventDefault();
		if (!currentInput) return;

		try {
			const result = parseExpression(currentInput);
			currentInput = String(result);
			waitingForOperand = true;
		} catch {
			currentInput = 'Error';
			waitingForOperand = true;
		}
	};

	const toggleSign = () => {
		if (currentInput.trim() === '') return;

		if (currentInput.startsWith('-')) {
			currentInput = currentInput.substring(1);
		} else {
			currentInput = `-${currentInput}`;
		}
	};

	const calculateSquareRoot = () => {
		const num = parseFloat(currentInput);
		if (!isNaN(num)) {
			if (num < 0) {
				currentInput = 'Error';
			} else {
				currentInput = String(Math.sqrt(num));
			}
			waitingForOperand = true;
		}
	};

	const calculatePercentage = () => {
		const num = parseFloat(currentInput);
		if (!isNaN(num)) {
			currentInput = String(num / 100);
			waitingForOperand = true;
		}
	};

	const calculateReciprocal = () => {
		const num = parseFloat(currentInput);
		if (!isNaN(num) && num !== 0) {
			currentInput = String(1 / num);
			waitingForOperand = true;
		} else {
			currentInput = 'Error';
			waitingForOperand = true;
		}
	};

	const memoryClear = () => {
		memory = 0;
	};
	const memoryRecall = () => {
		currentInput = String(memory);
		waitingForOperand = true;
	};
	const memoryStore = () => {
		const num = parseFloat(currentInput);
		if (!isNaN(num)) {
			memory = num;
		}
	};
	const memoryAdd = () => {
		const num = parseFloat(currentInput);
		if (!isNaN(num)) {
			memory += num;
		}
	};
</script>

<form class="root" onsubmit={calculate}>
	<input type="text" class="input" bind:value={currentInput}>

	<div class="placeholder"></div>
	<Button label="Backspace" onclick={backSpace} color="red" span={4} />
	<Button label="CE" onclick={clearEntry} color="red" span={3} />
	<Button label="C" onclick={clear} color="red" span={3} />

	<Button label="MC" onclick={memoryClear} color="red" />
	<Button label="7" onclick={() => addToEquation(7)} />
	<Button label="8" onclick={() => addToEquation(8)} />
	<Button label="9" onclick={() => addToEquation(9)} />
	<Button label="/" onclick={() => addToEquation('/')} color="red" />
	<Button label="sqrt" onclick={calculateSquareRoot} />

	<Button label="MR" onclick={memoryRecall} color="red" />
	<Button label="4" onclick={() => addToEquation(4)} />
	<Button label="5" onclick={() => addToEquation(5)} />
	<Button label="6" onclick={() => addToEquation(6)} />
	<Button label="*" onclick={() => addToEquation('*')} color="red" />
	<Button label="%" onclick={calculatePercentage} />

	<Button label="MS" onclick={memoryStore} color="red" />
	<Button label="1" onclick={() => addToEquation(1)} />
	<Button label="2" onclick={() => addToEquation(2)} />
	<Button label="3" onclick={() => addToEquation(3)} />
	<Button label="-" onclick={() => addToEquation('-')} color="red" />
	<Button label="1/x" onclick={calculateReciprocal} />

	<Button label="M+" onclick={memoryAdd} color="red" />
	<Button label="0" onclick={() => addToEquation(0)} />
	<Button label="+/-" onclick={toggleSign} />
	<Button label="." onclick={() => addToEquation('.')} />
	<Button label="+" onclick={() => addToEquation('+')} color="red" />
	<Button label="=" type="submit" color="red" />
</form>

<style>
	.root {
    width: clamp(15rem, 95vw, 20rem);
		display: grid;
		padding: var(--window-padding-inner);
		grid-template-columns: repeat(12, 1fr);
		gap: 0.25rem;
	}
	.input {
		grid-column: 1 / -1;
		margin-bottom: 0.5rem;
		padding: 0.1rem 0.5rem;
		font-size: 0.875rem;
		height: unset;
		text-align: right;
	}
	.placeholder {
		grid-column: span 2;
	}
</style>

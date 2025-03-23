<script lang="ts">
	import { SweeperIconFaceSmile, SweeperIconFaceWin, SweeperIconFaceShock, SweeperIconFaceDead, SweeperIconDigitMinus, sweeperIconsDigit } from '../../icons';
	import type { GameState } from '../../types';
	import { gameState } from '$apps/Minesweeper/constants';

	type Props = {
		minesLeft: number;
		timer: number;
		gameState: GameState;
		onReset: () => void;
		isPressingCell: boolean;
	};

	const { minesLeft, timer, gameState: currentGameState, onReset, isPressingCell }: Props = $props();

	const formatDigitalText = (value: number) => {
		const clampedValue = Math.max(Math.min(value, 999), -99);

		if (clampedValue < 0) {
			return '-' + String(Math.abs(clampedValue)).padStart(2, '0');
		} else {
			return String(clampedValue).padStart(3, '0');
		}
	};

	const getSmileyProps = () => {
		let smileyAlt = '';
		let smileySource = '';

		if (currentGameState === gameState.LOST) {
			smileyAlt = 'dead smiley';
			smileySource = SweeperIconFaceDead;
		} else if (currentGameState === gameState.WON) {
			smileyAlt = 'smiley with sunglasses';
			smileySource = SweeperIconFaceWin;
		} else if (isPressingCell) {
			smileyAlt = 'shocked smiley';
			smileySource = SweeperIconFaceShock;
		} else {
			smileyAlt = 'smiley';
			smileySource = SweeperIconFaceSmile;
		}

		return { smileyAlt, smileySource };
	};

	const { smileySource, smileyAlt } = $derived(getSmileyProps());

	const minesLeftFormatted = $derived(formatDigitalText(minesLeft));
	const timerFormatted = $derived(formatDigitalText(timer));
</script>

{#snippet digitalText(value: string)}
	<p class="digitalText" aria-label={value}>
		{#each value.split('') as char}
			{#if char === '-'}
				<img src={SweeperIconDigitMinus} alt="" draggable={false}>
			{:else}
				<img src={sweeperIconsDigit[Number(char)]} alt="" draggable={false}>
			{/if}
		{/each}
	</p>
{/snippet}

<div class="root">
	{@render digitalText(minesLeftFormatted)}

	<button aria-label="reset game" class="smileyButton" onclick={onReset}>
		<img src={smileySource} draggable={false} alt={smileyAlt} class="smiley" />
	</button>

	{@render digitalText(timerFormatted)}
</div>

<style>
	.root {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		margin-bottom: 0.25rem;
		box-shadow: var(--border-sunken-outer), var(--border-sunken-inner);
	}
	.smileyButton {
		padding: 0.25rem;
		background-color: var(--button-face);
		box-shadow: var(--border-window-inner);

		&:active {
			box-shadow: var(--border-sunken-outer);

			& .smiley {
				translate: 1px 1px;
			}
		}
	}
	.smiley {
		height: 1.75rem;
	}
	.digitalText {
		font-family: monospace;
		display: flex;
		height: 2.5rem;
	}
</style>

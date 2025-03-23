import { gameState, difficulty } from './constants';

type CellState = {
	isMine: boolean;
	isRevealed: boolean;
	isFlagged: boolean;
	neighborMines: number;
	isChordRevealed: boolean;
};

type CellCoords = {
	row: number;
	col: number;
};

type GameState = typeof gameState[keyof typeof gameState];
type Difficulty = typeof difficulty[keyof typeof difficulty];

export type {
	Difficulty,
	CellState,
	CellCoords,
	GameState,
};

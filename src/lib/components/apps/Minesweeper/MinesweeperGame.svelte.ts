import type { CellCoords, CellState, Difficulty, GameState } from './types';
import { gameState, difficulty } from './constants';
import { untrack } from 'svelte';

type DifficultySetting = {
	rows: number;
	cols: number;
	mines: number;
}
const difficultySettings: Record<Difficulty, DifficultySetting> = {
	// [difficulty.BEGINNER]: { rows: 2, cols: 2, mines: 1 },
	[difficulty.BEGINNER]: { rows: 9, cols: 9, mines: 10 },
	[difficulty.INTERMEDIATE]: { rows: 16, cols: 16, mines: 40 },
	[difficulty.EXPERT]: { rows: 16, cols: 30, mines: 99 },
};

class MinesweeperGame {
	public board: CellState[][] = $state([]);
	public timer = $state(0);

	public gameState = $state<GameState>(gameState.NOT_STARTED);
	private readonly isGameOver = $derived(this.gameState === gameState.WON || this.gameState === gameState.LOST);

	private flaggedCount = $state(0);
	public readonly settings = $state<DifficultySetting>(difficultySettings[difficulty.BEGINNER]);
	public readonly minesLeft = $derived(this.settings.mines - this.flaggedCount);

	private timerInterval: ReturnType<typeof setInterval> = 0;

	public clickedMine: CellCoords | null = $state(null);

	private mouseDownCoords: CellCoords | null = null;
	private leftMouseDown = false;
	private rightMouseDown = false;
	private doubleMouseDown = false;

	private chordCells: CellCoords[] = [];
	private chordIsCorrect = false;

	constructor(chosenDifficulty: Difficulty) {
		this.settings = difficultySettings[chosenDifficulty];
		this.initGame();

		$effect(() => {
			if (this.gameState === gameState.IN_PROGRESS) {
				this.timerInterval = setInterval(() => {
					this.timer++;
				}, 1000);
			}

			return () => {
				clearInterval(this.timerInterval);
			};
		});
	}

	initGame = () => {
		this.gameState = gameState.NOT_STARTED;
		this.clickedMine = null;
		this.flaggedCount = 0;

		const { rows, cols } = untrack(() => this.settings);
		this.board = Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => ({
				isRevealed: false,
				isFlagged: false,
				neighborMines: 0,
				isMine: false,
				isChordRevealed: false,
			})),
		);

		this.timer = 0;
	};

	handleMouseDown = (e: MouseEvent, mouseDownCoords: CellCoords) => {
		if (e.button === 0) this.leftMouseDown = true;
		if (e.button === 2) this.rightMouseDown = true;

		this.doubleMouseDown = this.leftMouseDown && this.rightMouseDown || e.button === 1;

		this.mouseDownCoords = mouseDownCoords;

		if (this.doubleMouseDown) {
			this.handleChordStart(mouseDownCoords);
		}
	};
	handleMouseUp = (e: MouseEvent) => {
		if (!this.doubleMouseDown && this.mouseDownCoords) {
			if (this.leftMouseDown) this.handleCellClick(this.mouseDownCoords);
			if (this.rightMouseDown) this.flagCell(this.mouseDownCoords);
		} else if (this.chordCells.length) {
			this.handleChordEnd();
		}

		if (e.button === 0) this.leftMouseDown = false;
		if (e.button === 2) this.rightMouseDown = false;
	};
	handleMouseOut = () => {
		this.mouseDownCoords = null;
		this.leftMouseDown = false;
		this.rightMouseDown = false;
	};

	private checkEndGame({ row, col }: CellCoords) {
		const clickedCell = this.board[row][col];
		if (clickedCell.isMine) {
			this.gameState = gameState.LOST;

			this.clickedMine = { row, col };

			const mines = this.board.flat().filter(({ isMine }) => isMine);
			this.board.flatMap((cell) => ({ ...cell, isRevealed: true }));
			for (const mine of mines) {
				mine.isRevealed = true;
			}
		} else {
			const hasWon = this.board.flat().every(({ isMine, isRevealed }) => isMine || isRevealed);

			if (hasWon) {
				this.gameState = gameState.WON;
			}
		}
	}

	private handleCellClick({ row, col }: CellCoords) {
		const cell = this.board[row][col];

		if (this.isGameOver || cell.isFlagged || cell.isRevealed) return;

		if (this.gameState === gameState.NOT_STARTED) {
			this.placeMines({ row, col });
			this.gameState = gameState.IN_PROGRESS;
		}

		this.revealCell({ row, col });
	}

	private revealCell({ row, col }: CellCoords) {
		const cell = this.board[row][col];

		if (cell.isRevealed || cell.isFlagged) return;

		cell.isRevealed = true;

		// reveal all adjacent cells if no neighboring mines (recursive)
		if (cell.neighborMines === 0 && !cell.isMine) {
			const neighborCells = this.getNeighborCells({ row, col });

			for (const neighborCell of neighborCells) {
				this.revealCell({ row: neighborCell.row, col: neighborCell.col });
			}
		}

		this.checkEndGame({ row, col });
	}

	private flagCell({ row, col }: CellCoords) {
		const cell = this.board[row][col];

		if (this.isGameOver || cell.isRevealed) return;

		cell.isFlagged = !cell.isFlagged;
		this.flaggedCount += cell.isFlagged ? 1 : -1;
	}

	private handleChordStart({ row, col }: CellCoords) {
		const neighborCells = this.getNeighborCells({ row, col });

		const coordsToChord = neighborCells.filter((c) => {
			const cellState = this.board[c.row][c.col];
			return !cellState.isRevealed && !cellState.isFlagged;
		});

		for (const coords of coordsToChord) {
			const cellState = this.board[coords.row][coords.col];
			cellState.isChordRevealed = true;
		}

		// love the english language
		this.chordCells = coordsToChord;

		const cellState = this.board[row][col];
		const adjacentFlags = neighborCells.filter((c) => this.board[c.row][c.col].isFlagged).length;
		// chord is only completed if flags match actual neighborMines
		// if chord is not completed, still show visual but don't reveal cells
		this.chordIsCorrect = adjacentFlags === cellState.neighborMines && cellState.isRevealed;
	}

	private handleChordEnd() {
		if (this.chordIsCorrect) {
			for (const { row, col } of this.chordCells) {
				this.revealCell({ row, col });
			}
		}

		for (const coords of this.chordCells) {
			const cellState = this.board[coords.row][coords.col];
			cellState.isChordRevealed = false;
		}

		this.chordCells = [];
		this.chordIsCorrect = false;
	}

	private placeMines({ row: initialRow, col: initialCol }: CellCoords) {
		let minesPlaced = 0;

		while (minesPlaced < this.settings.mines) {
			const row = Math.floor(Math.random() * this.settings.rows);
			const col = Math.floor(Math.random() * this.settings.cols);
			const cell = this.board[row][col];

			if (!cell.isMine && (row !== initialRow || col !== initialCol)) {
				cell.isMine = true;
				minesPlaced++;

				const neighborCells = this.getNeighborCells({ row, col });
				for (const neighborCell of neighborCells) {
					this.board[neighborCell.row][neighborCell.col].neighborMines++;
				}
			}
		}
	}

	private getNeighborCells({ row, col }: CellCoords) {
		const neighborCells: CellCoords[] = [];
		const { rows, cols } = this.settings;

		for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
			for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
				if (r !== row || c !== col) {
					neighborCells.push({ row: r, col: c });
				}
			}
		}

		return neighborCells;
	}
}

export default MinesweeperGame;

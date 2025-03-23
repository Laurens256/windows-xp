import type { Position, Size } from '$types';

type ConstructorProps = {
	width: number;
	height: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

class SnakeHandler {
	public isGameOver: boolean = $state(false);
	public isInitialStarted: boolean = $state(false);
	public snake: Position[] = $state([]);
	public score = $derived(this.snake.length);
	public food: Position = $state({ x: 0, y: 0 });
	public direction: Direction = $state('right');

	private bounds: Size;
	private inputDirection: Direction = 'right';
	private gameClock: ReturnType<typeof setInterval> | undefined = undefined;

	constructor({ width, height }: ConstructorProps) {
		this.bounds = { width, height };
		this.snake = Array.from({ length: 3 }, (_, i) => ({
			x: Math.floor(width / 2) - i,
			y: Math.floor(height / 2),
		}));
		this.food = this.getFreeSpace();
		this.inputDirection = 'right';
	}

	public startGame() {
		this.isInitialStarted = true;
		this.isGameOver = false;
		this.gameClock = setInterval(() => {
			this.move();
			this.direction = this.inputDirection;
			if (this.checkGameOver()) {
				this.stopGame();
			}
		}, 175);
	}

	public setInputDirection(input: Direction) {
		const isOppositeDirection =
			this.direction === 'up' && input === 'down'
			|| this.direction === 'down' && input === 'up'
			|| this.direction === 'left' && input === 'right'
			|| this.direction === 'right' && input === 'left';

		if (!isOppositeDirection) {
			this.inputDirection = input;
		}
	}

	protected move() {
		const head = this.snake[0];
		const newHead = { x: head.x, y: head.y };

		switch (this.inputDirection) {
			case 'up':
				newHead.y -= 1;
				break;
			case 'down':
				newHead.y += 1;
				break;
			case 'left':
				newHead.x -= 1;
				break;
			case 'right':
				newHead.x += 1;
				break;
		}

		this.snake.unshift(newHead);

		if (newHead.x === this.food.x && newHead.y === this.food.y) {
			this.food = this.getFreeSpace();
		} else {
			this.snake.pop();
		}
	}

	protected stopGame() {
		clearInterval(this.gameClock);
		this.isGameOver = true;
	}

	protected checkGameOver(): boolean {
		const head = this.snake[0];
		const isOutOfBounds = head.x < 0 || head.x >= this.bounds.width || head.y < 0 || head.y >= this.bounds.height;
		const isCollidingWithSelf = this.snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
		return isOutOfBounds || isCollidingWithSelf;
	}

	protected getFreeSpace(): Position {
		const freeSpaces: Position[] = [];
		const combinePosition = (position: Position): string => `${position.x},${position.y}`;
		const snakeSet = new Set(this.snake.map((segment) => combinePosition(segment)));

		for (let y = 0; y < this.bounds.height; y++) {
			for (let x = 0; x < this.bounds.width; x++) {
				if (!snakeSet.has(combinePosition({ x, y }))) {
					freeSpaces.push({ x, y });
				}
			}
		}

		return freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
	}
}

export default SnakeHandler;

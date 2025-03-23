const gameState = {
	NOT_STARTED: 'not-started',
	IN_PROGRESS: 'in-progress',
	WON: 'won',
	LOST: 'lost',
} as const;

const difficulty = {
	BEGINNER: 'Beginner',
	INTERMEDIATE: 'Intermediate',
	EXPERT: 'Expert',
} as const;

export { gameState, difficulty };

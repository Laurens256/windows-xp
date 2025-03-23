const parseNumber = (numStr: string) => {
	if (numStr === '') return 0;
	const num = parseFloat(numStr);
	if (isNaN(num)) throw new Error('Invalid number');
	return num;
};

const parseParentheses = (expression: string): number => {
	const parenRegex = /\(([^()]*)\)/;
	let match = parenRegex.exec(expression);

	while (match !== null) {
		const valueInParens = parsePlusMinus(match[1]);

		expression = expression.replace(match[0], valueInParens.toString());

		match = parenRegex.exec(expression);
	}

	return parsePlusMinus(expression);
};

const parsePlusMinus = (expression: string): number => {
	if (expression.includes('(') || expression.includes(')')) {
		return parseParentheses(expression);
	}

	if (expression.startsWith('-')) {
		return -parsePlusMinus(expression.substring(1));
	}

	const plusMinusMatch = /([+-])/;
	const plusMinusParts = expression.split(plusMinusMatch);

	if (plusMinusParts.length > 1) {
		let result = parseMultiplyDivide(plusMinusParts[0]);

		for (let i = 1; i < plusMinusParts.length; i += 2) {
			const operator = plusMinusParts[i];
			const value = parseMultiplyDivide(plusMinusParts[i + 1]);

			if (operator === '+') {
				result += value;
			} else if (operator === '-') {
				result -= value;
			}
		}

		return result;
	}

	return parseMultiplyDivide(expression);
};

const parseMultiplyDivide = (expression: string) => {
	const multiplyDivideMatch = /([*/])/;
	const multiplyDivideParts = expression.split(multiplyDivideMatch);

	if (multiplyDivideParts.length > 1) {
		let result = parseNumber(multiplyDivideParts[0]);

		for (let i = 1; i < multiplyDivideParts.length; i += 2) {
			const operator = multiplyDivideParts[i];
			const value = parseNumber(multiplyDivideParts[i + 1]);

			if (operator === '*') {
				result *= value;
			} else if (operator === '/') {
				if (value === 0) throw new Error('Division by zero');
				result /= value;
			}
		}

		return result;
	}

	return parseNumber(expression);
};

const parseExpression = (expression: string): number => {
	expression = expression.replace(/\s/g, '');

	return parsePlusMinus(expression);
};

export { parseExpression };

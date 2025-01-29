export const levenshtein = (a: string, b: string) => {
	const an = a.length;
	const bn = b.length;
	const matrix: number[][] = [];

	for (let i = 0; i <= bn; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= an; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= bn; i++) {
		for (let j = 1; j <= an; j++) {
			if (b[i - 1] === a[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1, // Ersetzung
					matrix[i][j - 1] + 1, // Einfügung
					matrix[i - 1][j] + 1 // Löschung
				);
			}
		}
	}

	return matrix[bn][an];
};

export const findClosestWord = (input: string, dictionary: string[]) => {
	let closestWord = dictionary[0];
	let minDistance = levenshtein(input, dictionary[0]);

	for (let i = 1; i < dictionary.length; i++) {
		const distance = levenshtein(input, dictionary[i]);
		if (input == dictionary[i]) {
			return input;
		}
		if (distance < minDistance) {
			closestWord = dictionary[i];
			minDistance = distance;
		}
	}

	return closestWord;
};

export const correctSentence = (sentence: string[], dictionary: string[]) => {
	return sentence.map((word) => findClosestWord(word, dictionary));
};

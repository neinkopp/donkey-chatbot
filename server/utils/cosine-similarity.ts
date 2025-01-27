type TermVector = { [term: string]: number };

export const cosineSimilarity = (
	vecA: TermVector,
	vecB: TermVector
): number => {
	let dotProduct = 0;
	let magnitudeA = 0;
	let magnitudeB = 0;

	// Compute dot product and magnitudes
	const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
	allTerms.forEach((term) => {
		const a = vecA[term] || 0;
		const b = vecB[term] || 0;
		dotProduct += a * b;
		magnitudeA += a ** 2;
		magnitudeB += b ** 2;
	});

	return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

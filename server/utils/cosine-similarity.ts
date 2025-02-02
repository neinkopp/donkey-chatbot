type TermVector = { [term: string]: number };

export const cosineSimilarity = (
	vecA: TermVector,
	vecB: TermVector
): number => {
	// Initialize sums for dot product and magnitudes
	let dotProduct = 0;
	let magnitudeA = 0;
	let magnitudeB = 0;

	// Collect all terms from both vectors
	const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

	// Calculate dot product and magnitudes
	allTerms.forEach((term) => {
		const a = vecA[term] || 0;
		const b = vecB[term] || 0;
		dotProduct += a * b;
		magnitudeA += a ** 2;
		magnitudeB += b ** 2;
	});

	// Final similarity value (dot product normalized by magnitudes)
	return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

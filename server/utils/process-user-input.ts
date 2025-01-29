import { cosineSimilarity } from "./cosine-similarity.ts";
import { MessageType, preprocess } from "./preprocess.ts";
import {
	calculateIDF,
	calculateTF,
	calculateTFIDFs,
	getDF,
	type Question,
	type TermVector,
} from "./tfidf.ts";

export const getBestAnswer = (
	question: string,
	questions: Question[],
	messageType: MessageType
) => {
	const questionTerms = preprocess(question, messageType);
	const questionTF = calculateTF(new Set(questionTerms));
	const questionVector = {} as TermVector;
	const idf = calculateIDF(getDF(questions, messageType), questions.length);
	questionTF.forEach((value, term) => {
		questionVector[term] = value * idf.get(term)!;
	});

	const tfidfs = calculateTFIDFs(questions, messageType);

	let maxSimilarity = 0;
	let bestMatchId: string | null = null;

	tfidfs.forEach((vector, id) => {
		const similarity = cosineSimilarity(questionVector, vector);
		if (similarity > maxSimilarity) {
			maxSimilarity = similarity;
			bestMatchId = id;
		}
	});

	if (bestMatchId === null) {
		return "Sorry, I don't understand.";
	} else {
		questions.find(({ id }) => id === bestMatchId)!.question ??
			"Sorry, I don't understand.";
	}
};

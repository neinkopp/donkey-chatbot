import { cosineSimilarity } from "./cosine-similarity.ts";
import { correctSentence } from "./levenshtein.ts";
import { cleanString, MessageType, stem, tokenize } from "./preprocess.ts";
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
	dictionary: string[],
	messageType: MessageType
) => {
	const cleanedQuestion = cleanString(question);
	const tokenizedQuestion = tokenize(cleanedQuestion, messageType);
	console.log("originalTerms", tokenizedQuestion);
	const correctedTerms = correctSentence(tokenizedQuestion, dictionary);
	console.log("correctedTerms", correctedTerms);
	const preprocessed = stem(correctedTerms);

	const questionTF = calculateTF(new Set(preprocessed));
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
		return null;
	} else {
		return questions.find(({ id }) => id === bestMatchId?.split(".")[0])!.id;
	}
};

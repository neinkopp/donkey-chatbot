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
	messageType: MessageType,
	catalog: {
		id: string;
		questions: string[];
		category: string;
	}[]
) => {
	const cleanedQuestion = cleanString(question);
	const tokenizedQuestion = tokenize(cleanedQuestion, messageType);
	console.log("originalTerms", tokenizedQuestion);
	const correctedTerms = correctSentence(tokenizedQuestion, dictionary);
	console.log("correctedTerms", correctedTerms);

	let category = "other";

	let filteredCatalog = catalog.slice();

	if (correctedTerms.includes("support") || correctedTerms.includes("escalate") || correctedTerms.includes("ticket")) {
		category = "support";
	} else if (correctedTerms.includes("app") || correctedTerms.includes("device") || correctedTerms.includes("devices")) {
		category = "app";
	} else if (!correctedTerms.includes("warranty")) {
		if (correctedTerms.includes("gardenbeetle")) {
			category = "gardenbeetle";
		} else if (correctedTerms.includes("cleanbug")) {
			category = "cleanbug";
		} else if (correctedTerms.includes("windowfly")) {
			category = "windowfly";
		}
	}
	console.log("Category: " + category);

	for (let i = 0; i < filteredCatalog.length; i++) {
		if (filteredCatalog[i].category == category) {
			filteredCatalog.splice(i, 1);
			i--;
		}
	}

	for (let i = 0; i < filteredCatalog.length; i++) {
		for (let j = 0; j < questions.length; j++) {
			if (filteredCatalog[i].id == questions[j].id) {
				questions.splice(j, 1);
				j--;
			}
		}
	}

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

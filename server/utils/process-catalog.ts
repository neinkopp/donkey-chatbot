import { cleanString, MessageType, tokenize } from "./preprocess.ts";
import type { Question } from "./tfidf.ts";

export const processCatalog = (
	catalog: {
		id: string;
		questions: string[];
	}[]
): {
	id: string;
	question: string;
}[] => {
	// flat map the questions
	const questions = catalog.flatMap(({ id, questions }) =>
		questions.map((question) => ({ id, question }))
	);
	return questions;
};

export const getDictionary = (questions: Question[]) => {
	const dictionary: string[] = [];

	questions.forEach((entry) => {
		//geht durch jedes Element im questions-Array
		const words = cleanString(entry.question);
		const tokenizedWords = tokenize(words, MessageType.Greeting);
		tokenizedWords.forEach((word) => {
			if (!dictionary.includes(word)) {
				//Diese Bedingung prüft, ob das word bereits im dictionary vorhanden ist.
				dictionary.push(word); // Füge das Wort hinzu, wenn es noch nicht im Wörterbuch ist dies verhindert, dass ein Wort mehrmals im dictionary auftaucht:
			}
		});
	});
	return dictionary;
};

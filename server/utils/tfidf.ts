import { MessageType, preprocess } from "./preprocess.ts";

export type Question = {
	id: string;
	question: string;
};
export type TermVector = { [term: string]: number };

export const getDF = (questions: Question[], messageType: MessageType) => {
	const df = new Map<string, number>();
	questions.forEach(({ question }) => {
		const preprocessed = preprocess(question, messageType);
		const terms = new Set(preprocessed);
		terms.forEach((term) => {
			df.set(term, (df.get(term) || 0) + 1);
		});
	});
	return df;
};

export const calculateIDF = (df: Map<string, number>, numDocs: number) => {
	const idf = new Map<string, number>();
	df.forEach((value, key) => {
		idf.set(key, Math.log(numDocs / value));
	});
	return idf;
};

export const calculateTF = (terms: Set<string>) => {
	const tf = new Map<string, number>();
	terms.forEach((term) => {
		tf.set(term, (tf.get(term) || 0) + 1);
	});
	return tf;
};

const calculateTFIDFPerQuestion = (
	questions: Question[],
	idf: Map<string, number>,
	messageType: MessageType
): Map<string, TermVector> => {
	const tfidfs = new Map<string, TermVector>();
	questions.forEach(({ id, question }) => {
		const preprocessed = preprocess(question, messageType);
		const terms = new Set(preprocessed);
		const tf = calculateTF(terms);
		const vector = {} as TermVector;
		tf.forEach((value, term) => {
			vector[term] = value * idf.get(term)!;
		});
		tfidfs.set(id, vector);
	});
	return tfidfs;
};

export const calculateTFIDFs = (
	questions: Question[],
	messageType: MessageType
): Map<string, TermVector> => {
	const df = getDF(questions, messageType);
	const idf = calculateIDF(df, questions.length);
	const tfidfs = calculateTFIDFPerQuestion(questions, idf, messageType);
	return tfidfs;
};

import natural from "npm:natural";

import catalog from "../catalog.json" with { type: "json" };

export enum MessageType {
	Question,
	Greeting,
}

const { WordTokenizer: Tokenizer, PorterStemmer } = natural;

const tokenizer = new Tokenizer();

export const cleanString = (text: string) => {
	// lowercase and remove punctuation
	const lower = text.toLowerCase().replace(/[^\w\s]/g, "");
	return lower;
};

export const tokenize = (text: string, messageType: MessageType) => {
	const cleaned = cleanString(text);
	const tokens = tokenizer.tokenize(cleaned);
	const stopWords = messageType === MessageType.Question ? new Set(catalog.stopWords.questions) : new Set(catalog.stopWords.greetings);
	return tokens.filter((token) => !stopWords.has(token));
};

export const stem = (tokens: string[]) => {
	return tokens.map(PorterStemmer.stem);
};

export const preprocess = (text: string, messageType: MessageType) => {
	const tokens = tokenize(text, messageType);
	const stemmed = stem(tokens);
	return stemmed;
};

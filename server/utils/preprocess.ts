import natural from "npm:natural";

const { WordTokenizer: Tokenizer, PorterStemmer } = natural;

const stopWords = new Set([
	"a",
	"an",
	"the",
	"is",
	"how",
	"do",
	"i",
	"to",
	"for",
	"on",
	"in",
	"and",
	"or",
	"my",
	"why",
]);
const tokenizer = new Tokenizer();

export const preprocess = (text: string) => {
	// lowercase and remove punctuation
	const lower = text.toLowerCase().replace(/[^\w\s]/g, "");
	// tokenize
	const tokens = tokenizer.tokenize(lower);
	// remove stop words and stem
	return tokens
		.filter((token) => !stopWords.has(token))
		.map(PorterStemmer.stem);
};

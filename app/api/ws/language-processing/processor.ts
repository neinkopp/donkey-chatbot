import natural from 'natural';
import catalog from './qa.json';

const qaCatalog = catalog.questions;

const WordTokenizer = natural.WordTokenizer;
const PorterStemmer = natural.PorterStemmer;

const stopWords = new Set([
  'a',
  'an',
  'the',
  'is',
  'how',
  'do',
  'i',
  'to',
  'for',
  'on',
  'in',
  'and',
  'or',
  'my',
  'why',
]);

const tokenizer = new WordTokenizer();

const preprocess = (text: string) => {
  // lowercase and remove punctuation
  const lower = text.toLowerCase().replace(/[^\w\s]/g, '');
  // tokenize
  const tokens = tokenizer.tokenize(lower);
  // remove stop words and stem
  return tokens.filter((token) => !stopWords.has(token)).map(PorterStemmer.stem);
};

type TermVector = { [term: string]: number };

// Flatten questions (main + alternatives) for TF-IDF computation
const allQuestions: { id: string; text: string }[] = [];
qaCatalog.forEach((qa) => {
  allQuestions.push({ id: qa.id, text: qa.question });
  qa.alternatives.forEach((alt) => {
    allQuestions.push({ id: qa.id, text: alt });
  });
});

// Step 1: Compute document frequency (DF) for terms
const df: { [term: string]: number } = {};
allQuestions.forEach((qa) => {
  const terms = preprocess(qa.text); // Preprocess to tokenize and clean text
  const uniqueTerms = new Set(terms);
  uniqueTerms.forEach((term) => {
    df[term] = (df[term] || 0) + 1;
  });
});
console.log(df);

// Step 2: Compute IDF for terms
const N = allQuestions.length; // Total number of "documents"
const idf: { [term: string]: number } = {};
Object.keys(df).forEach((term) => {
  idf[term] = Math.log(N / df[term]);
});

// Step 3: Compute TF-IDF vectors for questions
const tfidfVectors: { id: string; vector: TermVector }[] = [];
allQuestions.forEach((qa) => {
  const terms = preprocess(qa.text);
  const tf: { [term: string]: number } = {};
  terms.forEach((term) => {
    tf[term] = (tf[term] || 0) + 1 / terms.length; // Term frequency (TF)
  });
  const vector: TermVector = {};
  Object.keys(tf).forEach((term) => {
    vector[term] = tf[term] * (idf[term] || 0); // TF-IDF
  });
  tfidfVectors.push({ id: qa.id, vector });
});

console.log(tfidfVectors);

function cosineSimilarity(vecA: TermVector, vecB: TermVector): number {
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
}

function getResponse(userInput: string): string {
  const queryTerms = preprocess(userInput);
  const queryTF: { [term: string]: number } = {};
  queryTerms.forEach((term) => {
    queryTF[term] = (queryTF[term] || 0) + 1 / queryTerms.length;
  });
  const queryVector: TermVector = {};
  Object.keys(queryTF).forEach((term) => {
    queryVector[term] = queryTF[term] * (idf[term] || 0);
  });

  // Find the best match
  let bestMatchId: string | null = null;
  let bestSimilarity = 0;
  tfidfVectors.forEach(({ id, vector }) => {
    const similarity = cosineSimilarity(queryVector, vector);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatchId = id;
    }
  });
  return bestMatchId
    ? qaCatalog.find((qa) => qa.id === bestMatchId)?.answer ||
        "I apologize, but I'm not quite sure how to help with that. Could you please rephrase your question or provide more details?"
    : "I apologize, but I'm not quite sure how to help with that. Could you please rephrase your question or provide more details?";
}

export { getResponse };

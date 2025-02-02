import catalog from "./catalog.json" with { type: "json" };
import { getBestAnswer } from "./utils/get-best-answer.ts";
import { MessageType } from "./utils/preprocess.ts";
import { getDictionary, processCatalog } from "./utils/process-catalog.ts";


const sendMessage = (question: string, answer: string, socket: WebSocket, skipTimeout: boolean = false) => {
	const questionWordCount = question.split(" ").length;
	const answerWordCount = answer.split(" ").length;

	const readTime = questionWordCount * 0.01;
	const answerTime = answerWordCount * 0.05;

	const totalTime = readTime + answerTime;
	if(skipTimeout) {
		socket.send(answer);
		return;
	} else {
		setTimeout(() => {
			socket.send(answer);
		}, totalTime * 1000);
	}
};

export const handleMessageEvent = (event: MessageEvent, socket: WebSocket, skipTimeout: boolean = false) => {
	const question = event.data;
	const preprocessedQuestionCatalog = processCatalog(catalog.questions);
	const preprocessedGreetingCatalog = processCatalog(catalog.greetings);
	const dictionary = [
		getDictionary(preprocessedQuestionCatalog),
		getDictionary(preprocessedGreetingCatalog),
	].flat();

	const response = getBestAnswer(question, preprocessedQuestionCatalog, dictionary, MessageType.Question, catalog.questions);
	const answer = catalog.questions.find(({ id }) => id === response)?.answer;
	if (answer) {
		sendMessage(question, response + "|" + answer, socket, skipTimeout);
		return;
	}

	const greetingResponse = getBestAnswer(question, preprocessedGreetingCatalog, dictionary, MessageType.Greeting, catalog.greetings);
	const greetingAnswer = catalog.greetings.find(({ id }) => id === greetingResponse)?.answer;
	if (greetingAnswer) {
		sendMessage(event.data, greetingResponse + "|" + greetingAnswer, socket, skipTimeout);
	} else {
		sendMessage(event.data, 0 + "| " + catalog.default, socket, skipTimeout);
	}
}
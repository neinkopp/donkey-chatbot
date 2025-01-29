import catalog from "./catalog.json" with { type: "json" };
import { getBestAnswer } from "./utils/get-best-answer.ts";
import { MessageType } from "./utils/preprocess.ts";
import { getDictionary, processCatalog } from "./utils/process-catalog.ts";

export const handleMessageEvent = (event: MessageEvent, socket: WebSocket) => {
	const preprocessedQuestionCatalog = processCatalog(catalog.questions);
	const preprocessedGreetingCatalog = processCatalog(catalog.greetings);
	const dictionary = [
		getDictionary(preprocessedQuestionCatalog),
		getDictionary(preprocessedGreetingCatalog),
	].flat();

	const response = getBestAnswer(
		event.data,
		preprocessedQuestionCatalog,
		dictionary,
		MessageType.Question
	);
	const answer = catalog.questions.find(({ id }) => id === response)?.answer;
	if (answer) {
		socket.send(answer);
		return;
	}

	const greetingResponse = getBestAnswer(
		event.data,
		preprocessedGreetingCatalog,
		dictionary,
		MessageType.Greeting
	);
	const greetingAnswer = catalog.greetings.find(
		({ id }) => id === greetingResponse
	)?.answer;
	if (greetingAnswer) {
		socket.send(greetingAnswer);
	} else {
		socket.send(catalog.default);
	}
}
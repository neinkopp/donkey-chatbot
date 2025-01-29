import { assertEquals } from "@std/assert";
import { handleMessageEvent } from "./server/message-handler.ts";
import { MessageType } from "./server/utils/preprocess.ts";

import catalog from "./server/catalog.json" with { type: "json" };

const mockSocket = (messageType: MessageType, id: number) => ({
	send: (message: string) => {
		assertEquals(
			message,
			messageType === MessageType.Question ?
				catalog.questions.find(q => q.id === String(id))?.answer :
				catalog.greetings.find(g => g.id === String(id))?.answer
		);
	},
} as WebSocket);

Deno.test("replies with hello message to hello", async () => {
	await handleMessageEvent(
		{
			data: "Hello",
		} as MessageEvent,
		mockSocket(MessageType.Greeting, 1)
	);
});

Deno.test("replies with hello message to hi", async () => {
	await handleMessageEvent(
		{
			data: "Hi",
		} as MessageEvent,
		mockSocket(MessageType.Greeting, 1)
	);
});

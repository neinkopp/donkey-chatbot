export const handleOpenEvent = (socket: WebSocket) => {
	console.log("A client has connected.");
	socket.send(
		"Hello, I'm Donkeybot, BUGLAND Ltd's virtual assistant. If you have specific questions about a product, always include the product's name in the question. How may I assist you today?"
	);
};

export const handleOpenEvent = (socket: WebSocket) => {
	console.log("A client has connected.");
	socket.send(
		"Hello, I'm Donkeybot, BUGLAND Ltd's virtual assistant. How may I assist you today?"
	);
};

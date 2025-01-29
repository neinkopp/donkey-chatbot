function start() {
	const socket = new WebSocket("ws://localhost:8000");

	let responses = document.getElementById("balls");
	let userRequestText = document.getElementById("longlongman");
	let userRequestButton = document.getElementById("cum");

	socket.addEventListener("open", (event) => {
		console.log("WebSocket is open now.");
		createChatElement(event.data, "server");
	});
	socket.addEventListener("message", (event) => {
		createChatElement(event.data, "server");
	});

	socket.addEventListener("error", (event) => {
		console.error("WebSocket error: ", event);
		createChatElement(
			"💡 Uh oh, seems like Donkeybot is having a stroke! 😔 Try again later 💡",
			"system"
		);
	});

	socket.addEventListener("close", (event) => {
		console.log("WebSocket is closed now.");
		createChatElement("Donkeybot quit the call.", "system");
	});

	userRequestButton.addEventListener("click", () => {
		if (socket.readyState === WebSocket.OPEN && userRequestText.value) {
			socket.send(userRequestText.value);
			console.log("Message sent to server: " + userRequestText.value);
			createChatElement(userRequestText.value, "user");
			userRequestText.value = "";
		} else {
			console.log("WebSocket is not open.");
		}
	});
}

function createChatElement(text, origin) {
	let messageElement = document.createElement("p");
	let className = "";

	if (!text) {
		return;
	}

	switch (origin) {
		case "user":
			className = "boob1";
			break;
		case "server":
			className = "boob2";
			bzzzzt();
			break;
		case "system":
			className = "donkeybrain";
			break;
	}
	messageElement.className = className;
	messageElement.textContent = text;
	document.getElementById("balls").appendChild(messageElement);
	document.getElementById("balls").scrollTop = 99999999;
}

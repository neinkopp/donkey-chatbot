function start() {
	const host = window.location.hostname;
	const uri = host === "localhost" ? "ws://localhost:8000" : `wss://${host}`;
	const socket = new WebSocket(uri);

	let userRequestText = document.getElementById("inp-input");
	let userRequestButton = document.getElementById("btn-send");

	let writingIndicator = document.getElementById("write-indicator");

	socket.addEventListener("open", (event) => {
		console.log("WebSocket is open now.");
		createChatElement(event.data, "server");
	});
	socket.addEventListener("message", (event) => {
		createChatElement(event.data, "server");
		writingIndicator.style.visibility = "hidden";
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
			writingIndicator.style.visibility = "visible";
		} else {
			console.log("WebSocket is not open.");
			createChatElement(
				"💡 Uh oh, seems like Donkeybot is having a stroke! 😔 Try again later 💡",
				"system"
			);
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
			className = "userMessage";
			break;
		case "server":
			className = "botMessage";
			text = getAngry(text);
			break;
		case "system":
			className = "systemMessage";
			break;
	}
	messageElement.className = className;
	document.getElementById("chatCon").appendChild(messageElement);
	fillChatElement(text, messageElement, origin);
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const fillChatElement = async (text, textBox, origin) => {
	if (origin === "server") {
		words = text.split(" ");
		textBox.textContent = words[0];
		for (let i = 1; i < words.length; i++) {
			await delay(100);
			textBox.textContent = textBox.textContent + " " + words[i];
			document.getElementById("chatCon").scrollTop = 99999999;
		}
	} else {
		textBox.textContent = text;
		document.getElementById("chatCon").scrollTop = 99999999;
	}
};

function getAngry(text) {
	let splitText = text;
	let result = splitText.split("|");

	console.log(result);
	let id = result[0];

	if (id == "43" || id == "44" || id == "45" || id == "46") {
		let element = document.getElementById("img-evil");
		element.style.visibility = "visible";
		bzzzzt(true);
	} else {
		let element = document.getElementById("img-evil");
		element.style.visibility = "hidden";
		bzzzzt();
	}

	if (result.length > 1) {
		return result[1];
	} else {
		return text;
	}
}

function start() {
	const socket = new WebSocket("ws://localhost:8000");

	//let responses = document.getElementById("balls");
	let userRequestText = document.getElementById("longlongman");
	let userRequestButton = document.getElementById("cum");

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
			text = getAngry(text);
			bzzzzt();
			break;
		case "system":
			className = "donkeybrain";
			break;
	}
	messageElement.className = className;
	document.getElementById("balls").appendChild(messageElement);
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
			document.getElementById("balls").scrollTop = 99999999;
		}
	} else {
		textBox.textContent = text;
		document.getElementById("balls").scrollTop = 99999999;
	}
};


function getAngry(text){

	let splitText = text;
	let result = splitText.split("|");

	console.log(result);
	let id = (result[0]);

	if(id=="36"||id=="37"||id=="38" ||id=="39" && !id){  
		let element = document.getElementById('img-evil');
		element.style.visibility = 'visible';
	}
	else{
	let element = document.getElementById('img-evil');
	element.style.visibility = 'hidden';
	}
	

	if(result.length>1){
		return result[1];
	}
	else{
		return text;
	}

}



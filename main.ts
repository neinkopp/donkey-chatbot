import { serveDir } from "jsr:@std/http/file-server";

import { handleMessageEvent } from "./server/message-handler.ts";
import { handleOpenEvent } from "./server/open-handler.ts";

Deno.serve((req) => {
	if (req.headers.get("upgrade") != "websocket") {
		// serve static files from app directory
		return serveDir(req, {
			fsRoot: "./app",
		});
	}

	// upgrade the connection to a WebSocket
	const { socket, response } = Deno.upgradeWebSocket(req);

	// handle WebSocket events
	socket.addEventListener("open", () => handleOpenEvent(socket));
	socket.addEventListener("message", (event) =>
		handleMessageEvent(event, socket)
	);
	return response;
});

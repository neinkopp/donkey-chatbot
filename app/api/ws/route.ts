import { getResponse } from './language-processing/processor';

export function SOCKET(
  client: import('ws').WebSocket,
  request: import('http').IncomingMessage,
  server: import('ws').WebSocketServer
) {
  console.log('A client connected, request:', request.url, 'server:', server.options.port);

  client.on('message', (message) => {
    const messageString = message.toString();
    const response = getResponse(messageString);
    client.send(response);
  });

  client.on('close', () => {
    console.log('A client disconnected');
  });
}

export function GET(
  _request: import('http').IncomingMessage,
  response: import('http').ServerResponse
) {
  response.end('Hello, world! Please use WebSocket to communicate with me.');
}

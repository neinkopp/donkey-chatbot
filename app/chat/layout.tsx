'use client';

import { WebSocketProvider } from 'next-ws/client';

export default function ChatLayout({ children }: { children: any }) {
  return <WebSocketProvider url="ws://localhost:3000/api/ws">{children}</WebSocketProvider>;
}

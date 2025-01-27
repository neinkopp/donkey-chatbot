'use client';

import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from 'next-ws/client';
import { Box, Button, Flex, Group, ScrollArea, Stack, TextInput } from '@mantine/core';

interface ChatMessage {
  text: string;
  isServer: boolean;
  timestamp: number;
}

export default function Page() {
  const ws = useWebSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      const payload = typeof event.data === 'string' ? event.data : await event.data.text();
      setMessages((prev) => [...prev, { text: payload, isServer: true, timestamp: Date.now() }]);
    }

    ws?.addEventListener('message', onMessage);
    return () => ws?.removeEventListener('message', onMessage);
  }, [ws]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    const message = inputRef.current?.value;
    if (message && message.trim()) {
      ws?.send(message);
      setMessages((prev) => [...prev, { text: message, isServer: false, timestamp: Date.now() }]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <Flex direction="column" h="100vh" maw={800} mx="auto" p="md">
      <ScrollArea h="100%" mb="md" viewportRef={chatContainerRef} pr="lg">
        <Stack gap="md">
          {messages.map((msg, index) => (
            <Flex key={msg.timestamp + index} justify={msg.isServer ? 'flex-start' : 'flex-end'}>
              <Box
                p="sm"
                style={{
                  position: 'relative',
                  maxWidth: '70%',
                  backgroundColor: msg.isServer ? '#751034' : '#228be6',
                  color: '#fff',
                  borderRadius: '8px',
                  borderBottomLeftRadius: msg.isServer ? '0' : '8px',
                  borderBottomRightRadius: msg.isServer ? '8px' : '0',
                }}
              >
                {msg.text}
              </Box>
            </Flex>
          ))}
        </Stack>
      </ScrollArea>

      <Group gap="sm" pr="lg">
        <TextInput ref={inputRef} flex={1} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
        <Button onClick={handleSend}>Send</Button>
      </Group>
    </Flex>
  );
}

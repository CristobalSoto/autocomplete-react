// useWebSocket.tsx
import { useState, useEffect, useRef } from 'react';

interface WebSocketMessage<T> {
  completion: number;
  data?: T;
}

export function useWebSocket<T = any>(url: string) {
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [data, setData] = useState<T | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(url);
    ws.current = websocket;

    websocket.onopen = () => console.log('WebSocket connected');

    websocket.onmessage = (event) => {
      const message: WebSocketMessage<T> = JSON.parse(event.data);
      setCompletionPercentage(message.completion);
      if (message.data) {
        setData(message.data);
      }
    };

    websocket.onerror = (error) => console.error('WebSocket error', error);
    websocket.onclose = () => console.log('WebSocket disconnected');

    return () => {
      websocket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return { completionPercentage, data, sendMessage };
}

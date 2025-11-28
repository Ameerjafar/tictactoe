import { useState, useEffect, useRef, useCallback } from "react";

export interface UseWebSocketReturn {
  socket: WebSocket | null;
  messages: any;
  isConnected: boolean;
  sendMessage: (data: any) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any>();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnects = 5;

  const connect = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8080");
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      reconnectAttempts.current = 0;
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(data);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
      setSocket(null);
      if (reconnectAttempts.current < maxReconnects) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        setTimeout(() => {
          reconnectAttempts.current++;
          connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (socket && isConnected) {
        console.log(data);
      socket.send(JSON.stringify(data));
    }
  }, [socket, isConnected]);

  return { socket, messages, isConnected, sendMessage };
};

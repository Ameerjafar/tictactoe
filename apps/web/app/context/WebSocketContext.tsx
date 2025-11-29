'use client'
import { createContext, useContext } from 'react';
import { UseWebSocketReturn, useWebSocket } from '../hooks/useWebSocket';
const WebSocketContext = createContext<UseWebSocketReturn | null>(null);
export const WebSocketProvider = ({ children }: { children: React.ReactNode })  => {
  const ws = useWebSocket();
  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => {
    const context =  useContext(WebSocketContext);
    if(!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
}
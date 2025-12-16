import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageSquare, X } from 'lucide-react';

interface ChatComponentProps {
    currentUserId: string; // The logged-in user (Company)
    recipientId: string;   // The profile user (Student)
    recipientName: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ currentUserId, recipientId, recipientName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Unique room ID for this pair
    const roomId = `chat_${currentUserId}_${recipientId}`;

    useEffect(() => {
        if (isOpen && !socket) {
            const newSocket = io('http://localhost:5000'); // Adjust URL if needed
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join_room', roomId);
            });

            newSocket.on('receive_message', (data) => {
                setMessages((prev) => [...prev, data]);
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isOpen, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && socket) {
            const msgData = {
                roomId,
                senderId: currentUserId,
                text: message,
                timestamp: new Date().toISOString(),
            };

            await socket.emit('send_message', msgData);
            // Optimistically add message to UI (or wait for receive_message if you want strict sync)
            // setMessages((prev) => [...prev, msgData]); 
            // Note: If backend broadcasts to sender too, we don't need to add it manually here.
            // My backend implementation does io.to(room).emit, so it sends to everyone in room including sender.

            setMessage('');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-600 text-white p-4 rounded-full shadow-lg hover:bg-brand-700 transition-colors z-50 flex items-center gap-2"
            >
                <MessageSquare size={24} />
                <span className="font-medium">Chat with {recipientName}</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden h-[500px]">
            {/* Header */}
            <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {recipientName.charAt(0)}
                    </div>
                    <span className="font-semibold">{recipientName}</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 text-sm mt-4">
                        Start a conversation with {recipientName}
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe
                                        ? 'bg-brand-600 text-white rounded-br-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;

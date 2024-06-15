import { Button } from "@/components/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from 'next/navigation'; // import useRouter from next/router

interface ChatPageProps {
  id: string;
}

let socket = io("ws://localhost:8080/");

export function ChatPage({ id }: ChatPageProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('')
  const [parterTyping, setPartnerTyping] = useState(false);
  const router = useRouter(); // initialize router

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // redirect to login if no token found
    }
  }, []);

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:8080/api/v1/chats/${id}`);
    console.log(id)
    const data = await res.json();
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  useEffect(() => {
    console.log(id)
    socket = io("ws://localhost:8080/");

    socket.on("connect", () => {
      console.log("connected");
      socket!.emit("JOIN_CHAT", {
        chatId: id,
      });
    });

    socket.on("MESSAGE", (message) => {
      setMessages((current) => [...current, message]);
    });

    socket.on("PARTER_TYPING", () => {
      setPartnerTyping(true);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      localStorage.removeItem('token'); // remove token when disconnect
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPartnerTyping(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [parterTyping]);

  const newMessage = {
    text: message
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();

    if (message.trim() === "") return;

    const response = fetch(`http://localhost:8080/api/v1/chats/${id}/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newMessage),
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ... */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div className={`flex items-start gap-4 ${message.sender === 'YourUsername' ? 'justify-end' : ''}`} key={message._id}>
            <div className="bg-gray-300 font-semibold text-lg p-4 rounded-lg max-w-[80%]">
              <p className="text-cyan-500">{message.sender}</p>
              <p className="text-xl text-black mt-2">
                {message.text}
              </p>
              <p className="text-sm text-black font-mono mt-2">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* ... */}
    </div>
  );
}

// export default ChatPage;
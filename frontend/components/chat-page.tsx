import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import Link from "next/link";


export function ChatPage({id} : {id: string}) {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [partnerTyping, setPartnerTyping] = useState(false);

  if (!localStorage.getItem("token")) {
    const router = useRouter();
    router.push('/login');
  }

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:8080/api/v1/chats/${id}`);
    const data = await res.json();
    // console.log(data)
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  useEffect(() => {
    console.log(id);
    const socket = io("http://localhost:8080/");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("connected");
      socket!.emit("JOIN_CHAT", {
        chatId: id,
      });
    });

    socket.on("MESSAGE", (message) => {
      setMessages((current) => [...current, message]);
    });

    socket.on("PARTNER_TYPING", () => {
      setPartnerTyping(true);
    });

    socket.on("PARTNER_STOP_TYPING", () => {
      setPartnerTyping(false);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPartnerTyping(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [partnerTyping]);

  const newMessage = {
    text: message,
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();

    if (message.trim() === "") return;

    const response = fetch(`http://localhost:8080/api/v1/chats/${id}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newMessage),
    });

    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  }

  

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-8 px-6 flex items-center justify-between">
        <div>
        <h1 className="text-xl font-bold"> WeChat </h1>
        {/* {<p className="text-sm text-green-500">Online</p>} */}
        {/* {partnerTyping && <p className="text-sm text-blue-500">Typing...</p>} */}
        </div>
        <div className="px-4 py-3 bg-black rounded-lg transition duration-300 ease-in-out hover:bg-white hover:text-black font-mono text-lg font-medium cursor-pointer">
          <Link onClick={handleLogout} href="/login">
            Logout
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            className={`flex items-start gap-4 ${
              message.sender === localStorage.getItem("username")
                ? "justify-end"
                : "justify-start"
            }`}
            key={message._id}
          >
            <div
              className={`font-semibold text-lg p-4 rounded-xl max-w-[80%] ${
                message.sender === localStorage.getItem("username")
                  ? "bg-[#303030] text-white rounded-br-none"
                  : "bg-gray-300 rounded-bl-none"
              }`}
            >
              <p className="">{message.sender}</p>
              <p className="text-xl mt-2">{message.text}</p>
              <p className="text-sm font-mono mt-2">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 p-4 flex items-center">
        <form className="flex-1 flex" onSubmit={handleSendMessage}>
          <Input
            className="flex-1  border-none focus:ring-0"
            placeholder="Type your message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button className="ml-4" variant="ghost" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
}



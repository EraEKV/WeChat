"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { ChatPage } from "@/components/chat-page";
import Link from "next/link";

let socket = null;

export default function Home() {
  // useEffect(() => {
  //   socket = io("http://localhost:3000");

  //   socket.on("connect", () => {
  //     console.log("connected");
  //   });

  //   socket.on("hello", (arg) => {
  //     console.log(arg); // world
  //     toast(arg);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("disconnected");
  //   });
  // }, []);

  return (
    <main className="min-h-screen">
      <header className="items-center space-y-6 pt-[50%] sm:pt-[20%] md:pt-[25%] lg:py-[15%]">
        <div className="text-center max-w-[300px] sm:max-w-[400px] mx-auto space-y-2 ">
          <h1 className="text-black font-bold text-xl sm:text-3xl md:text-4xl">Welcome to WeChat!</h1>
          <p className="text-gray-400 font-bold text-base sm:text-lg md:text-xl">For chatting with your friend just click the button below.</p>
        </div>
        <div className="text-center w-[150px] bg-black border-[2px] border-black rounded-lg mx-auto text-white text-lg sm:text-xl px-3 py-2 transition duration-300 ease-in-out hover:bg-white hover:text-black cursor-pointer" >
          <Link href="/chats/666c01b4395389beceb87ebf">
            Chat now
          </Link>
        </div>
      </header>
      <ToastContainer />
    </main>
  );
}

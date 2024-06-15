"use client";

import { ToastContainer, toast } from "react-toastify";
import { ChatPage } from "@/components/chat-page";
import "react-toastify/dist/ReactToastify.css";

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="">
      {/* <ChatPage id={params.id as string} /> */}
      <ChatPage id="666bcb7166540f92a983d788" /> 
     
      <ToastContainer />
    </main>
  );
}





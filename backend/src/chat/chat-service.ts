import mongoose from "mongoose";
import { messageModel } from "./models/message";
import { chatModel } from "./models/chat";



class ChatService {
  async sendTextMessage(username: string, chatId: string, text: string) {
    const message = await messageModel.create({
      chat: chatId,
      sender: username,
      text: text,
      isRead: false,
    });

    await chatModel.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });
  }

  async sendFileMessage(from: string, chatId: string, fileUrl: string) {
    const message = await messageModel.create({
      chat: chatId,
      sender: from,
      fileUrl: fileUrl,
      isRead: false
    });

    await chatModel.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });
  }

  async createChat(participants: mongoose.Types.ObjectId[]) {
    const chat = await chatModel.create({ participants });
    return chat;
  }
}


export default ChatService;
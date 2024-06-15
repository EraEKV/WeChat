import { Router } from "express";
import multer from 'multer';
import { authMiddleware } from "../middlewares/auth-middleware";
import CloudStorageService from "../services/cloud-storage-service";
import ChatService from "./chat-service";
import { chatModel } from "./models/chat";
import { messageModel } from "./models/message";

const upload = multer({ dest: 'uploads/' });
const chatRouter = Router();

const chatService = new ChatService();
const cloudStorageService = new CloudStorageService();

chatRouter.post("/:id/send", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const { user } = req;
  await chatService.sendTextMessage((user as any).username, id, text);
  res.send(`message sended`);
}); 

chatRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const chat = await chatModel.findById(id);
  const messages = await messageModel.find({ chat: chat?.id });
  res.json({ chat, messages });
});

chatRouter.post('/:id/sendFile', authMiddleware, upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const fileUrl = await cloudStorageService.uploadFile(file.path);
    await chatService.sendFileMessage((user as any).id, id, fileUrl);
    res.send('message with file sended successfully!');
  } catch (error) {
    res.status(500).send('Error uploading file.');
  }
});

chatRouter.post('/create', authMiddleware, async (req, res) => {
  const { participants, usernames } = req.body;

  if (!participants || !Array.isArray(participants)) {
    return res.status(400).send('Participants must be an array of user IDs.');
  }

  try {
    const chat = await chatService.createChat(participants, usernames);
    res.status(201).json({ chat });
  } catch (error) {
    res.status(500).send('Error creating chat.');
  }
});

export default chatRouter;
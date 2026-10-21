import { Conversation } from "../model/converstion.model.js";

export async function createConversation(data) {
  return await Conversation.create(data);
}

export async function findConversationById(conversationId) {
  return await Conversation.findById(conversationId);
}


export async function findConversationByMessage(originalMessage) {
  return await Conversation.findOne({ originalMessage });
}


export async function getUserConversations(userId) {
  return await Conversation.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "name")
    .populate("receiver", "name")
    .populate("originalMessage", "content createdAt")
    .sort({ createdAt: -1 });
}
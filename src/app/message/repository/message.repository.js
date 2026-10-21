
import { Messsage } from './../model/message.model.js';





export async function sendMessage(content, receiver, sender, type ) {
  return Messsage.create({
    content,
    sender,
    receiver,
    type,
  });
}






export async function getMessages(userId) {
  return await Messsage.find({
    receiver: userId,
    isDeleted: false,
  })
    .select("content receiver sender type createdAt")
    .populate("sender", "name")
    .sort({ createdAt: -1 });
}




export async function findMessageById(id) {
  return await Messsage.findById({ _id: id
  })
}
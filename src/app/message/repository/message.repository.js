
import { Messsage } from './../model/message.model.js';


export async function sendMessage(content,receiver,sender){
return Messsage.create({
    content:content,
    sender:sender,
    receiver:receiver
})


}




export async function getMessages(userId) {
  return await Messsage.find({
    receiver: userId,
    isDeleted: false,
  })
    .populate("sender", "name")
    .sort({ createdAt: -1 });
}
import { validationBody } from '../../../lib/validation/validation.js'
import { sendMessageDto } from '../dto/message.dto.js'
import * as messageService from '../service/message.service.js'

export async function sedMessage(req,res,next){

    try {
        const data=validationBody(sendMessageDto,req.body)
        const {content,receiver}=data
        const sender=req.user?.id
    const createMessage=await messageService.sendMessage(content,receiver,sender)

        
    return res.status(201).json({
      message: "Message Created successfully",
      success: true,
data:createMessage
    });



    } catch (error) {
        next(error)
    }

}


export async function getMessage(req, res, next) {
    try {
            const userId = req.user.id;


            const messages=await messageService.getMessage(userId)


    return res.status(200).json({
      message: "Messages Retrive successfully",
      success: true,
      data: messages,
    });
    } catch (error) {
    next(error);
    
    }

}
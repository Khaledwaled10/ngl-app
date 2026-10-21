import * as conversionService from "../service/converstion.service.js"



export async function createConversion(req,res,next){

    try {
        

            const { requestId } = req.body;
    const receiverId = req.user.id;

    const conversation =
      await conversionService.createConverstion(
        requestId,
        receiverId
      );

    return res.status(201).json({
      message: "Conversation created successfully",
      success: true,
      data: conversation,
    });

    } catch (error) {
            next(error);

    }

}





export async function getUserConversations(req, res, next) {
  try {
    const userId = req.user.id;

    const conversations =
      await conversionService.getUserConversations(userId);

    return res.status(200).json({
      message: "Conversations retrieved successfully",
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
}

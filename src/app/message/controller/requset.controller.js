import * as identityRequestService from "../service/request.service.js";

export async function requestIdentity(req, res, next) {
  try {
    const { messageId } = req.params;
    const requesterId = req.user.id;

    const request = await identityRequestService.requestSenderIdentity(
      messageId,
      requesterId
    );

    return res.status(201).json({
      success: true,
      message: "Identity request created successfully",
      data: {
        _id: request._id,
        message: request.message,
        status: request.status,
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}


export async function getRequestSender(req, res, next) {
  try {
    const senderId = req.user.id;

    const data = await identityRequestService.getIdentityRequests( senderId    );

    return res.status(201).json({
      success: true,
      message: "Identity retrived successfully",
      data: data
    });
  } catch (error) {
    next(error);
  }
}



export async function acceptIdentityRequest(req, res, next) {
  try {
    const { requestId } = req.params;

    const request = await identityRequestService.acceptOrRejectRequest(
      requestId,
      req.user.id,
      "accepted"
    );

    return res.status(200).json({
      success: true,
      message: "Identity request accepted successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectIdentityRequest(req, res, next) {
  try {
    const { requestId } = req.params;

    const request = await identityRequestService.acceptOrRejectRequest(
      requestId,
      req.user.id,
      "rejected"
    );

    return res.status(200).json({
      success: true,
      message: "Identity request rejected successfully",
      data: request,
    });
  } catch (error) {
    next(error);
  }
}
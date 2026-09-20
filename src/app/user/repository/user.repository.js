
import { User } from "../../auth/model/auth.model.js";

export async function updateUser(email, userUpdate) {
  return await User.findOneAndUpdate(
    { email },
    userUpdate,
    { new: true }
  );
}
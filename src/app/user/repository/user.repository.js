import { User } from "../../auth/model/auth.model.js";

export async function updateUser(email, userUpdate) {
  return await User.findOneAndUpdate({ email }, userUpdate, { new: true });
}

export async function finduserById(id) {
  return User.findOne({ _id: id, isDeleted: false }, { password: 0 },{});
}

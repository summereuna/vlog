import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

//이 this 는 = user 임
//따라서 this.password 는 user.password 임 ㅇㅇ

//`isModified()`
//property가 수정되면 isModified가 true 가 되고, 아니면 false
//`isModified("password")` password가 수정되면 true가 되게 하기

const User = mongoose.model("User", userSchema);
export default User;

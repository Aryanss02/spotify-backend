import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";




//register api start
async function registerUser(req, res) {

  const { username, email, password, role = "user" } = req.body;



  //checking if user already exists
  const isUserAlreadyExists = await userModel.findOne({

    $or: [                // $or:[] => username hoya email
      { username },
      { email }
    ]

  })



  //if Already exists
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exixts"
    })
  }


  const hash = await bcrypt.hash(password, 10)

  //if user doesn't Exists
  const user = await userModel.create({
    username,
    email,
    password: hash,
    role
  })


  //Creating Token
  const token = jwt.sign({
    id: user._id,
    role: user.role,


  }, process.env.JWT_SECRET)


  //Setting Cookies
  res.cookie("token", token)


  //Sending Response back
  res.status(201).json({
    message: "User registered Successfully",
    user


  })


}
//register api end





//Login api start
async function loginUser(req, res) {

  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [
      { username },
      { email }
    ]

  })


  if (!user) {
    return res.status(401).json({ message: "Invalid Credentials" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)


  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Credentials" })
  }



  const token = jwt.sign({

    id: user._id,
    role: user.role,
  }, process.env.JWT_SECRET)


  res.cookie("token", token)

  res.status(200).json({
    message: "User Logged in successfully ",
    user: {

      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role

    }
  })


}
//Login api end


//Logout api start
async function logoutUser(req, res) {
  res.clearCookie("token")
  res.status(200).json({
    message: "User logged out successfully"
  })

}
//Logout api end





export default { registerUser, loginUser, logoutUser };
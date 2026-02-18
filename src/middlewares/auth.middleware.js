import jwt from 'jsonwebtoken';

async function authArtist(req, res, next) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role !== "artist") {
      return res.status(401).json({ message: "you can't create music" })
    }

    req.user = decoded;
    next();
  }

  catch (error) {

    return res.status(401).json({ message: "Unauthorized" })

  }
}



async function authUser(req, res, next) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    if (decoded.role == "user" || decoded.role == "artist") {

      req.user = decoded;
      return next();

    }

    return res.status(403).json({ message: "you can not access" })



  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Unauthorized" })

  }

}


export default { authArtist, authUser };
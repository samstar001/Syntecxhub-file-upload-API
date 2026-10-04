// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log(authHeader); // testing mode
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded); // testing mode
    req.user = decoded;
    console.log(decoded); // testing mode
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

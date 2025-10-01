import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



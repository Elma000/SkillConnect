import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    } catch (err) {
      // invalid token - leave req.userId unset
    }
  }
  next();
};

export const checkLoggedIn = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

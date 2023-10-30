import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;
  const authToken = req.headers.authorization;
  if (authToken !== undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];

    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.status(401).json({ err: "Invalid token" });
      } else {
        req.token = token;
        req.loggedUser = { id: data.id, email: data.email };
        next();
      }
    });
  } else {
    res.status(401).json({ err: "Invalid token" });
  }
  next();
}

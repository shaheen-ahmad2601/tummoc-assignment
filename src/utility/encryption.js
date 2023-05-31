import jwt from "jsonwebtoken";

const privateKey = process.env.ENCRYPTION_KEY || "some random salt";

export function createToken(data) {
  return jwt.sign(data, privateKey, { expiresIn: "1h" });
}

export function verifyToken(token) {
  return jwt.verify(token, privateKey);
}

export default { createToken, verifyToken };

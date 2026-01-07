import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type Payload = {
  id: number;
  email: string;
  name: string;
};

export function signToken(payload: Payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, JWT_SECRET) as Payload;
}

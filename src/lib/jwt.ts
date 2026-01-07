import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

// JWT payload should avoid including plaintext PII such as email.
export type Payload = {
  id: number;
  name?: string | null;
  // optional non-PII identifier derived from email (e.g., SHA256)
  emailHash?: string;
};

export function emailToHash(email: string) {
  return crypto
    .createHash("sha256")
    .update(email.toLowerCase().trim())
    .digest("hex");
}

export function signToken(payload: Payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, JWT_SECRET) as Payload;
}

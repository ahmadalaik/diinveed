import crypto from "crypto";
import { SESSION_COOKIE } from "./constants";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export { sha256, generateToken, SESSION_COOKIE };

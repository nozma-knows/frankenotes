import jwt_decode from "jwt-decode";
import { jwtVerify, SignJWT } from "jose";

interface VerifyTokenProps {
  token: string | null;
}

interface TokenType {
  userId: string;
  expiry: Date;
}

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export const getJwtPrivateKey = () => {
  const secret = process.env.NEXT_PUBLIC_JWT_PRIVATE_KEY;
  console.log("secret: ", secret);
  if (!secret || secret.length === 0) {
    throw new Error("NEXT_PUBLIC_JWT_PRIVATE_KEY not set.");
  }
  return secret;
};

export default async function VerifyToken({ token }: VerifyTokenProps) {
  if (!token) throw new Error("No token provided.");
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtPrivateKey())
    );
    return verified.payload as UserJwtPayload;
  } catch (error) {
    throw new Error("Your token has expired.");
  }
}

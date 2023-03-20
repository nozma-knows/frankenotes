import jwt_decode from "jwt-decode";

interface DecodeTokenProps {
  token: string | null;
}

interface TokenType {
  userId: string;
  expiry: Date;
}

export default function DecodeToken({ token }: DecodeTokenProps) {
  if (token) {
    const decoded: TokenType = jwt_decode(token);
    return decoded;
  }
  return null;
}

import jwt from "jsonwebtoken"


// ---------- Generate a Token ----------
export const generateAuthToken = async (id: string) => {
  return jwt.sign({id}, process.env.JWT_TOKEN, {expiresIn: '30d'});
}

// ---------- Decode the Auth Token ----------
export const decodeAuthToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, process.env.JWT_TOKEN);
}
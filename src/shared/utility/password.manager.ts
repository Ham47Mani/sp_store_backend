import bcrypt from "bcrypt";

// -------- Generate a Hash Password --------
export const generateHashPassword = async (password: string) => {
  const slat = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, slat);
};

// -------- Compare Password with Hash Password --------
export const comparePassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
}
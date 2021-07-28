import bcrypt from "bcryptjs";

export const matchPassword = (p: string, hash: string): Promise<boolean> =>
  bcrypt.compare(p, hash);

const salt = 8;
export const hashPassword = (p: string): Promise<string> =>
  bcrypt.hash(p, salt);

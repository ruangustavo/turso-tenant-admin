import * as argon2 from "argon2";

export const hashPassword = async (password: string) => {
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 1, // 1 thread
  });
  return hashedPassword;
};

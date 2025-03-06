import crypto from "crypto";

export const encodePassword = (userPassword: string) => {
  return crypto.createHash("md5").update(userPassword).digest("hex");
};

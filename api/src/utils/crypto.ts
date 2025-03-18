import * as crypto from "crypto";
import "dotenv/config";

const SignKey = process.env.JWT_SECRET as string;

export default (str: string): string => {
  let md5 = crypto.createHash("md5");
  md5.update(SignKey + str);
  return md5.digest("hex") as string;
};

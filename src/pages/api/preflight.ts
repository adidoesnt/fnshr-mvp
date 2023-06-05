import { NextApiRequest } from "next";

export const API_KEY = process.env.NEXT_PUBLIC_FNSHR_API_KEY;

export const defaultReqConfig = {
  headers: { "x-api-key": API_KEY },
};

export function preflight(req: NextApiRequest) {
  if (!req?.headers) {
    return false;
  }
  const testKey = req.headers["x-api-key"];
  return testKey && testKey == API_KEY;
}

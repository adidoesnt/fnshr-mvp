import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  username: string;
  password: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password } = req.body;
  res
    .status(200)
    .json({ username, password });
}

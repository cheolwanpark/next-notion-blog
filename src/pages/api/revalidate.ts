import { config } from "@/config";
import type { NextApiRequest, NextApiResponse } from "next";

type RevalidateResponse = {
  success: boolean;
  message?: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>,
) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Method" });
    }
    const { secret, path } = JSON.parse(req.body);
    if ((secret as string) !== config.secret) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Secret" });
    }
    await res.revalidate(path as string);
    res.status(200).json({ success: true });
  } catch (e) {
    res
      .status(400)
      .json({ success: false, message: `Exception Catched, ${e}` });
  }
};

export default handler;

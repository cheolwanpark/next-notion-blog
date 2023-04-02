import { getBlock } from "@/services/notion/block";
import { ImageBlockExtended } from "@/services/notion/types/block";
import type { NextApiRequest, NextApiResponse } from "next";

type GetBlockResponse = {
  block: ImageBlockExtended | null;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetBlockResponse>,
) => {
  try {
    const { id } = req.query;
    const block = (await getBlock(id as string)) as ImageBlockExtended;
    res.status(block ? 200 : 400).json({ block });
  } catch (_) {
    res.status(400).json({ block: null });
  }
};

export default handler;

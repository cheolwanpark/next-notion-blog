import { isFullBlock } from "@notionhq/client";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import pMemoize from "p-memoize";
import { notion } from "./api";

const getBlocksImpl = async (parentID: string, page_size?: number) => {
  let blocks: BlockObjectResponse[] = [];
  let response = await notion.blocks.children.list({
    block_id: parentID,
    page_size,
  });
  blocks = blocks.concat(response.results.filter(isFullBlock));
  while (response.has_more && response.next_cursor !== null) {
    response = await notion.blocks.children.list({
      block_id: parentID,
      start_cursor: response.next_cursor,
      page_size,
    });
    blocks = blocks.concat(response.results.filter(isFullBlock));
  }
  return blocks;
};

export const getBlocks = pMemoize(getBlocksImpl);

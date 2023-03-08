import { isFullBlock } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import pMap from "p-map";
import pMemoize from "p-memoize";
import { notion } from "./api";
import { BlockWithChildren } from "./types/block";

const getBlocksImpl = async (
  parentID: string,
  page_size?: number,
): Promise<BlockWithChildren[]> => {
  let blocks: BlockWithChildren[] = [];
  let response = await notion.blocks.children.list({
    block_id: parentID,
    page_size,
  });
  blocks = blocks.concat(await processResponse(response));
  while (response.has_more && response.next_cursor !== null) {
    response = await notion.blocks.children.list({
      block_id: parentID,
      start_cursor: response.next_cursor,
      page_size,
    });
    blocks = blocks.concat(await processResponse(response));
  }
  return blocks;
};

const processResponse = async (
  response: ListBlockChildrenResponse,
): Promise<BlockWithChildren[]> => {
  const fullBlocks = response.results.filter(isFullBlock);
  return await pMap(fullBlocks, retrieveChildren, { concurrency: 2 });
};

const retrieveChildren = async (
  block: BlockObjectResponse,
): Promise<BlockWithChildren> => {
  if (block.has_children) {
    const children = await getBlocks(block.id);
    return {
      ...block,
      children,
    };
  } else {
    return {
      ...block,
      children: [],
    };
  }
};

export const getBlocks = pMemoize(getBlocksImpl);

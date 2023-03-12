import { config } from "@/config";
import { isFullBlock } from "@notionhq/client";
import {
  ImageBlockObjectResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import dayjs from "dayjs";
import pMap from "p-map";
import pMemoize from "p-memoize";
import probeIamgeSize from "probe-image-size";
import { notion } from "./api";
import {
  BlockObject,
  BlockWithChildren,
  ImageBlockExtended,
} from "./types/block";

const getBlockImpl = async (blockID: string): Promise<BlockObject | null> => {
  const block = await notion.blocks.retrieve({ block_id: blockID });
  if (!isFullBlock(block)) return null;
  if (block.type === "image") {
    return await retrieveAdditionalInfo(block);
  } else {
    return block;
  }
};

export const getBlock = pMemoize(getBlockImpl);

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
  const fullBlocks = response.results.filter(isFullBlock).map(async (block) => {
    if (block.type !== "image") return block;
    return await retrieveAdditionalInfo(block);
  });
  return await pMap(fullBlocks, retrieveChildren, { concurrency: 2 });
};

const retrieveChildren = async (
  block: BlockObject,
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

const retrieveAdditionalInfo = async (
  block: ImageBlockObjectResponse,
): Promise<ImageBlockExtended> => {
  const url =
    block.image.type === "external"
      ? block.image.external.url
      : block.image.file.url;
  const { width, height } = await probeIamgeSize(url);
  const cacheExpiryTime = dayjs.utc().add(config.imageCachingTime, "seconds");
  return {
    ...block,
    dim: {
      width,
      height,
    },
    cacheExpiryTime: cacheExpiryTime.format(),
  };
};

export const getBlocks = pMemoize(getBlocksImpl);

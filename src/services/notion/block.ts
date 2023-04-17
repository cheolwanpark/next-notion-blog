import { isFullBlock } from "@notionhq/client";
import {
  BlockObjectResponse,
  BookmarkBlockObjectResponse,
  EquationBlockObjectResponse,
  EquationRichTextItemResponse,
  ImageBlockObjectResponse,
  ListBlockChildrenResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import pMap from "p-map";
import { getPlaiceholder } from "plaiceholder";
import pMemoize from "p-memoize";
import { getMetadata } from "../webmetadata";
import { notion } from "./api";
import {
  BlockObject,
  BlockWithChildren,
  BookmarkBlockExtended,
  EquationBlockExtended,
  ImageBlockExtended,
} from "./types/block";
import { renderKatex } from "../katex";

const getBlockImpl = async (blockID: string): Promise<BlockObject | null> => {
  const block = await notion.blocks.retrieve({ block_id: blockID });
  if (!isFullBlock(block)) return null;
  return await retrieveAdditionalInfo(block);
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
  const fullBlocks = response.results
    .filter(isFullBlock)
    .map(renderAllEquations)
    .map(retrieveAdditionalInfo);
  const blocks = await pMap(fullBlocks, retrieveChildren, { concurrency: 2 });
  return blocks;
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
  block: BlockObjectResponse,
): Promise<BlockObject> => {
  if (block.type === "image") {
    return await retrieveImageAdditionalInfo(block);
  } else if (block.type === "bookmark") {
    return await retrieveBookmarkAdditionalInfo(block);
  } else if (block.type === "equation") {
    return retrieveEquationAdditionalInfo(block);
  } else {
    return block;
  }
};

const retrieveImageAdditionalInfo = async (
  block: ImageBlockObjectResponse,
): Promise<ImageBlockExtended> => {
  const url =
    block.image.type === "external"
      ? block.image.external.url
      : block.image.file.url;
  const { base64, img } = await getPlaiceholder(url, { size: 16 });
  return {
    ...block,
    dim: {
      width: img.width,
      height: img.height,
    },
    blurDataURL: base64,
  };
};

const retrieveBookmarkAdditionalInfo = async (
  block: BookmarkBlockObjectResponse,
): Promise<BookmarkBlockExtended> => {
  const url = block.bookmark.url;
  const metadata = await getMetadata(url);
  return {
    ...block,
    metadata,
  };
};

const retrieveEquationAdditionalInfo = (
  block: EquationBlockObjectResponse,
): EquationBlockExtended => {
  return {
    ...block,
    katexHtml: renderKatex(block.equation.expression) || "",
  };
};

const renderAllEquations = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(renderAllEquations);
  } else if (obj && typeof obj === "object") {
    if (isRichTextWithEquation(obj)) {
      return {
        ...obj,
        katexHtml: renderKatex(obj.equation.expression) || "",
      };
    }
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) obj[key] = renderAllEquations(obj[key]);
    }
    return obj;
  } else {
    return obj;
  }
};

const isRichTextWithEquation = (
  item: any,
): item is EquationRichTextItemResponse => {
  const plain_text_exists =
    (<RichTextItemResponse>item).plain_text !== undefined;
  const annotations_exists =
    (<RichTextItemResponse>item).annotations !== undefined;
  const type_match = (<RichTextItemResponse>item).type === "equation";
  return plain_text_exists && annotations_exists && type_match;
};

export const getBlocks = pMemoize(getBlocksImpl);

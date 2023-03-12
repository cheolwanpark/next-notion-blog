import {
  BlockObjectResponse,
  ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type WithChildren = {
  children: BlockWithChildren[];
};

export type BlockWithChildren = BlockObject & WithChildren;
export type BlockObject =
  | Exclude<BlockObjectResponse, ImageBlockObjectResponse>
  | ImageBlockExtended;

export type ImageBlockExtended = ImageBlockObjectResponse & {
  dim: {
    width: number;
    height: number;
  };
  cacheExpiryTime: string;
};

import { WebMetadata } from "@/services/webmetadata";
import {
  BlockObjectResponse,
  BookmarkBlockObjectResponse,
  ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type WithChildren = {
  children: BlockWithChildren[];
};

export type BlockWithChildren = BlockObject & WithChildren;
export type BlockObject =
  | Exclude<
      BlockObjectResponse,
      ImageBlockObjectResponse | BookmarkBlockObjectResponse
    >
  | ImageBlockExtended
  | BookmarkBlockExtended;

export type ImageBlockExtended = ImageBlockObjectResponse & {
  dim: {
    width: number;
    height: number;
  };
  blurDataURL: string;
};

export type BookmarkBlockExtended = BookmarkBlockObjectResponse & {
  metadata: WebMetadata;
};

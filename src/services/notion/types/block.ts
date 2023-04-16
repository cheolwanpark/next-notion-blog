import { WebMetadata } from "@/services/webmetadata";
import {
  BlockObjectResponse,
  BookmarkBlockObjectResponse,
  EquationBlockObjectResponse,
  EquationRichTextItemResponse,
  ImageBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

type WithChildren = {
  children: BlockWithChildren[];
};

type EquationRichText = EquationRichTextItemResponse & {
  katexHtml?: string;
};

export type RichTextObject =
  | Exclude<RichTextItemResponse, EquationRichTextItemResponse>
  | EquationRichText;

type ExtendRichText<T> = {
  [K in keyof T]: T[K] extends RichTextItemResponse
    ? RichTextObject
    : T[K] extends object
    ? ExtendRichText<T[K]>
    : T[K];
};

export type ExtendBlock<T> = ExtendRichText<T> & WithChildren;

export type BlockWithChildren = ExtendBlock<BlockObject>;

export type BlockObject =
  | Exclude<
      BlockObjectResponse,
      | ImageBlockObjectResponse
      | BookmarkBlockObjectResponse
      | EquationBlockObjectResponse
    >
  | ImageBlockExtended
  | BookmarkBlockExtended
  | EquationBlockExtended;

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

export type EquationBlockExtended = EquationBlockObjectResponse & {
  katexHtml: string;
};

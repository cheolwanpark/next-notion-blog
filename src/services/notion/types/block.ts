import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type WithChildren = {
  children: BlockWithChildren[];
};
export type BlockWithChildren = BlockObjectResponse & WithChildren;

import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export const plainText = (text: RichTextItemResponse[]) => {
  return text.map((block) => block.plain_text).join("");
};

export const notNull = <T>(v: T | null): v is T => {
  return v !== null;
};

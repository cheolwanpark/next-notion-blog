import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export const plainText = (text: RichTextItemResponse[]) => {
  return text.map((block) => block.plain_text).join("");
};

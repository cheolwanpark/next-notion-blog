import { ExtendBlock } from "@/services/notion/types";
import { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import classNames from "classnames";
import { getColorClass } from "./colors";
import { RichText } from "./richtext";

// TODO: support childs
export const Paragraph = ({
  block,
}: {
  block: ExtendBlock<ParagraphBlockObjectResponse>;
}) => {
  return (
    <p className={classNames(getColorClass(block.paragraph.color))}>
      <RichText richTexts={block.paragraph.rich_text} />
    </p>
  );
};

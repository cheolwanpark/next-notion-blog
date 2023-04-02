import { WithChildren } from "@/services/notion/types/block";
import { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import classNames from "classnames";
import { getColorClass } from "./colors";
import { RichText } from "./richtext";

// TODO: support childs
export const Paragraph = ({
  block,
}: {
  block: ParagraphBlockObjectResponse & WithChildren;
}) => {
  return (
    <p className={classNames(getColorClass(block.paragraph.color))}>
      <RichText richTexts={block.paragraph.rich_text} />
    </p>
  );
};

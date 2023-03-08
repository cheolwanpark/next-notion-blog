import { WithChildren } from "@/services/notion/types/block";
import { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { RichText } from "./richtext";

// TODO: support childs
export const Paragraph = ({
  block,
}: {
  block: ParagraphBlockObjectResponse & WithChildren;
}) => {
  return (
    <p>
      <RichText
        richTexts={block.paragraph.rich_text}
        defaultColor={block.paragraph.color}
      />
    </p>
  );
};

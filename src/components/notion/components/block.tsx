import { BlockWithChildren } from "@/services/notion/types/block";
import { Blank } from "@/components/blank";
import { Paragraph } from "./paragraph";
import { Heading1, Heading2, Heading3 } from "./headings";
import { Quote } from "./quote";
import { BulletedList, NumberedList } from "./list";
import { Divider } from "./divider";
import { NotionImage } from "./image";
import { Callout } from "./callout";
import { Column, ColumnList } from "./columnlist";
import { Bookmark } from "./bookmark";
import { Equation } from "./equation";
import { Video } from "./video";
import { Code } from "./code";

export const Block = ({
  block,
  blocks,
  idx,
}: {
  block: BlockWithChildren;
  blocks: BlockWithChildren[];
  idx: number;
}) => {
  switch (block.type) {
    case "paragraph":
      return <Paragraph block={block} />;
    case "heading_1":
      return <Heading1 block={block} />;
    case "heading_2":
      return <Heading2 block={block} />;
    case "heading_3":
      return <Heading3 block={block} />;
    case "quote":
      return <Quote block={block} />;
    case "bulleted_list_item":
      return <BulletedList block={block} blocks={blocks} idx={idx} />;
    case "numbered_list_item":
      return <NumberedList block={block} blocks={blocks} idx={idx} />;
    case "divider":
      return <Divider block={block} />;
    case "code":
      return <Code block={block} />;
    case "image":
      return <NotionImage block={block} />;
    case "callout":
      return <Callout block={block} />;
    case "column_list":
      return <ColumnList block={block} />;
    case "column":
      return <Column block={block} />;
    case "bookmark":
      return <Bookmark block={block} />;
    case "equation":
      return <Equation block={block} />;
    case "video":
      return <Video block={block} />;
    default:
      return <Blank />;
  }
};

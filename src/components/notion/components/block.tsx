import { BlockWithChildren } from "@/services/notion/types/block";
import { Blank } from "./blank";
import { Heading1, Heading2, Heading3 } from "./headings";
import { BulletedList, NumberedList } from "./list";
import { Paragraph } from "./paragraph";
import { Quote } from "./quote";

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
    default:
      return <Blank />;
  }
};

import { BlockWithChildren } from "@/services/notion/types/block";
import dynamic from "next/dynamic";
import { Blank } from "./blank";
import { Callout } from "./callout";
import { Divider } from "./divider";
import { Heading1, Heading2, Heading3 } from "./headings";
import { NotionImage } from "./image";
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
    case "divider":
      return <Divider block={block} />;
    case "code":
      return <Code block={block} />;
    case "image":
      return <NotionImage block={block} />;
    case "callout":
      return <Callout block={block} />;
    default:
      return <Blank />;
  }
};

const Code = dynamic(() =>
  import("./code").then(async (mod) => {
    await import("@/services/prism");
    return mod.Code;
  }),
);

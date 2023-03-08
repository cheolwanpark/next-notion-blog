import { BlockWithChildren } from "@/services/notion/types/block";
import { Heading1, Heading2, Heading3 } from "./headings";
import { Paragraph } from "./paragraph";

export const Block = ({ block }: { block: BlockWithChildren }) => {
  switch (block.type) {
    case "paragraph":
      return <Paragraph block={block} />;
    case "heading_1":
      return <Heading1 block={block} />;
    case "heading_2":
      return <Heading2 block={block} />;
    case "heading_3":
      return <Heading3 block={block} />;
    default:
      return <div></div>;
  }
};

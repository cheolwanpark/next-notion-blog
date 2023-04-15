import { BlockWithChildren } from "@/services/notion/types/block";
import { Blank } from "@/components/blank";
import dynamic from "next/dynamic";

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

// lazy load
const Paragraph = dynamic(() =>
  import("./paragraph").then(async (mod) => mod.Paragraph),
);

const Heading1 = dynamic(() =>
  import("./headings").then(async (mod) => mod.Heading1),
);

const Heading2 = dynamic(() =>
  import("./headings").then(async (mod) => mod.Heading2),
);

const Heading3 = dynamic(() =>
  import("./headings").then(async (mod) => mod.Heading3),
);

const Quote = dynamic(() => import("./quote").then(async (mod) => mod.Quote));

const BulletedList = dynamic(() =>
  import("./list").then(async (mod) => mod.BulletedList),
);

const NumberedList = dynamic(() =>
  import("./list").then(async (mod) => mod.NumberedList),
);

const Divider = dynamic(() =>
  import("./divider").then(async (mod) => mod.Divider),
);

const Code = dynamic(() =>
  import("./code").then(async (mod) => {
    await import("@/services/prism");
    return mod.Code;
  }),
);

const NotionImage = dynamic(() =>
  import("./image").then(async (mod) => mod.NotionImage),
);

const Callout = dynamic(() =>
  import("./callout").then(async (mod) => mod.Callout),
);

const ColumnList = dynamic(() =>
  import("./columnlist").then(async (mod) => mod.ColumnList),
);

const Column = dynamic(() =>
  import("./columnlist").then(async (mod) => mod.Column),
);

const Bookmark = dynamic(() =>
  import("./bookmark").then(async (mod) => mod.Bookmark),
);

const Equation = dynamic(() =>
  import("./equation").then(async (mod) => mod.Equation),
);

const Video = dynamic(() => import("./video").then(async (mod) => mod.Video));

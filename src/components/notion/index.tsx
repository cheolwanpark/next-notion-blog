import { BlockWithChildren } from "@/services/notion/types/block";
import { Block } from "./components/block";

export const NotionRenderer = ({ blocks }: { blocks: BlockWithChildren[] }) => {
  return (
    <div>
      {blocks.map((block, idx, arr) => {
        return <Block block={block} blocks={arr} idx={idx} key={idx} />;
      })}
    </div>
  );
};

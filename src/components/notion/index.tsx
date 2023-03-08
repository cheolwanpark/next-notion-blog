import { BlockWithChildren } from "@/services/notion/types/block";
import { Block } from "./components/block";

export const NotionRenderer = ({ blocks }: { blocks: BlockWithChildren[] }) => {
  return (
    <div>
      {blocks.map((block, idx) => {
        return <Block block={block} key={idx} />;
      })}
    </div>
  );
};

import { isNotFoundError } from "@/services/notion/api/error";
import { query } from "@/services/notion/query";
import { PageMeta } from "@/services/notion/types";
import { getBlocks } from "@/services/notion/block";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { isServer } from "@/services/utils";
import { NotionRenderer } from "@/components/notion";
import { BlockWithChildren } from "@/services/notion/types/block";
import { content } from "@/services/font";

export default function PostPage({
  meta,
  blocks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!isServer) {
    console.log(meta);
    console.log(blocks);
  }
  return (
    <article className={content} data-nopico>
      <NotionRenderer blocks={blocks} />
    </article>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const createProp = (meta: PageMeta | null, blocks: BlockWithChildren[]) => {
    return {
      props: { meta, blocks },
    };
  };
  try {
    const queryResult = await query({
      path: ctx.query.path as string,
    });
    if (queryResult.pages.length !== 1) {
      return createProp(null, []);
    }
    const meta = queryResult.pages[0];
    const blocks = await getBlocks(meta.id);
    return createProp(meta, blocks);
  } catch (error) {
    if (isNotFoundError(error)) {
      return createProp(null, []);
    }
  }
}

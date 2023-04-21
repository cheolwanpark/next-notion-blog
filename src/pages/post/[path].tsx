import { isNotFoundError } from "@/services/notion/api/error";
import { query } from "@/services/notion/query";
import { PageMeta } from "@/services/notion/types";
import { getBlocks } from "@/services/notion/block";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NotionRenderer } from "@/components/notion";
import { BlockWithChildren } from "@/services/notion/types/block";
import { config } from "@/config";
import { MetaHead } from "@/components/head";
import dayjs from "dayjs";
import { ScrollToTopButton } from "@/components/scrolltotop";
import { Comments } from "@/components/comments";

export default function PostPage({
  meta,
  blocks,
  revalidatedTime,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <MetaHead
        title={`${meta.title}`}
        description={meta.description}
        url={`${config.baseURL}/post/${meta.path}`}
      />
      <article data-nopico>
        <NotionRenderer blocks={blocks} meta={meta} />
      </article>
      <Comments title={meta.title} />
      <ScrollToTopButton />
      <input type="hidden" name="Revalidated Time" value={revalidatedTime} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const createProp = (meta: PageMeta | null, blocks: BlockWithChildren[]) => {
    const revalidatedTime = dayjs().utc().format("YYYY/MM/DD HH:mm:ss Z");
    return {
      props: { meta, blocks, revalidatedTime },
      revalidate: config.revalidateTime,
    };
  };
  try {
    const queryResult = await query({
      query: { path: ctx.params!.path as string },
    });
    if (queryResult.pages.length < 1) {
      return createProp(null, []);
    }
    const meta = queryResult.pages[0];
    const blocks = await getBlocks(meta.id);
    return createProp(meta, blocks);
  } catch (error) {
    if (isNotFoundError(error)) {
      return createProp(null, []);
    }
    throw error;
  }
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

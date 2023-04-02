import { isNotFoundError } from "@/services/notion/api/error";
import { query } from "@/services/notion/query";
import { PageMeta } from "@/services/notion/types";
import { getBlocks } from "@/services/notion/block";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { isServer } from "@/services/utils";
import { NotionRenderer } from "@/components/notion";
import { BlockWithChildren } from "@/services/notion/types/block";
import { content } from "@/services/font";
import { useRouter } from "next/router";
import { Spinner } from "@/components/spinner";
import { config } from "@/config";

export default function PostPage({
  meta,
  blocks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!isServer) {
    console.log(meta);
    console.log(blocks);
  }
  const router = useRouter();
  if (router.isFallback) {
    return <Spinner />;
  } else {
    return (
      <article className={content} data-nopico>
        <NotionRenderer blocks={blocks} meta={meta} />
      </article>
    );
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const createProp = (meta: PageMeta | null, blocks: BlockWithChildren[]) => {
    return {
      props: { meta, blocks },
      revalidate: config.revalidateTime,
    };
  };
  try {
    const queryResult = await query({
      query: { path: ctx.params!.path as string },
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
    throw error;
  }
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

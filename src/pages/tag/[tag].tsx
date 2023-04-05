import { MetaHead } from "@/components/head";
import { SearchablePosts } from "@/components/searchable_posts";
import { config } from "@/config";
import { ui } from "@/services/font";
import { query } from "@/services/notion/query";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

export default function Home({
  pages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { tag } = router.query;
  return (
    <>
      <MetaHead
        title={`${config.blogTitle} | ${tag}`}
        description={`${tag} posts`}
        url={`${config.baseURL}/tag/${tag}`}
      />
      <h1 className={ui}>#{tag}</h1>
      <SearchablePosts posts={pages} size={config.postsPerPage} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const PAGES_PER_LOAD = 100;
  let response = await query({
    query: {
      type: "and",
      tags: [ctx.params!.tag as string],
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
    page_size: PAGES_PER_LOAD,
  });
  const pages = response.pages;
  while (response.next_cursor) {
    response = await query({
      query: { cursor: response.next_cursor },
      page_size: PAGES_PER_LOAD,
    });
    pages.push(...response.pages);
  }
  return {
    props: {
      pages,
    },
    revalidate: config.revalidateTime,
  };
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

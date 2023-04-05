import { MetaHead } from "@/components/head";
import { SearchablePosts } from "@/components/searchable_posts";
import { config } from "@/config";
import { ui } from "@/services/font";
import { query } from "@/services/notion/query";
import { GetStaticProps, InferGetStaticPropsType } from "next";

export default function Home({
  pages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <MetaHead
        title={`${config.blogTitle} | All Posts`}
        description={`all posts`}
        url={`${config.baseURL}/post`}
      />
      <h1 className={ui}>All Posts</h1>
      <SearchablePosts posts={pages} size={config.postsPerPage} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const PAGES_PER_LOAD = 100;
  let response = await query({
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

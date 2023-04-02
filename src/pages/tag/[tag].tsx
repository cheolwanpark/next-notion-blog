import { Posts } from "@/components/posts";
import { config } from "@/config";
import { ui } from "@/services/font";
import { query } from "@/services/notion/query";
import { PageMeta } from "@/services/notion/types";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function Home({ pages }: { pages: PageMeta[] }) {
  const router = useRouter();
  const { tag } = router.query;
  return (
    <>
      <h1 className={ui}>#{tag}</h1>
      <Posts posts={pages} size={config.postsPerPage} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  };
};

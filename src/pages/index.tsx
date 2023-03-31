import { Intro } from "@/components/intro";
import { Posts } from "@/components/posts";
import { query } from "@/services/notion/query";
import { PageMeta } from "@/services/notion/types";
import { GetServerSideProps } from "next";

export default function Home({ pages }: { pages: PageMeta[] }) {
  const PAGE_PER_VIEW = 5;
  return (
    <>
      <Intro />
      <Posts posts={pages} size={PAGE_PER_VIEW} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
  };
};

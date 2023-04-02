import { Intro } from "@/components/intro";
import { Posts } from "@/components/posts";
import { config } from "@/config";
import { query } from "@/services/notion/query";
import { PageMeta } from "@/services/notion/types";
import { GetServerSideProps } from "next";
import Link from "next/link";
import styles from "@/styles/homepage.module.css";
import classNames from "classnames";
import { ui } from "@/services/font";

export default function Home({ pages }: { pages: PageMeta[] }) {
  return (
    <>
      <Intro />
      <Posts posts={pages} size={config.previewPosts} />
      <Link
        href="/post"
        className={classNames(styles.allposts, ui)}
        data-nopico
      >
        All Posts →
      </Link>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const PAGES_PER_LOAD = config.previewPosts;
  let response = await query({
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
    page_size: PAGES_PER_LOAD,
  });
  return {
    props: {
      pages: response.pages,
    },
  };
};

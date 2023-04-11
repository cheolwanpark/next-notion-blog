import { Intro } from "@/components/intro";
import { Posts } from "@/components/posts";
import { config } from "@/config";
import { query } from "@/services/notion/query";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import styles from "@/styles/homepage.module.scss";
import { MetaHead } from "@/components/head";

export default function Home({
  pages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <MetaHead />
      <Intro />
      <Posts posts={pages} size={config.previewPosts} />
      <Link href="/post" className={styles.allposts} data-nopico>
        All Posts →
      </Link>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
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
    revalidate: config.revalidateTime,
  };
};

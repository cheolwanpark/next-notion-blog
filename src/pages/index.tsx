import { Intro } from "@/components/intro";
import { Posts } from "@/components/posts";
import { isServer } from "@/services/is_server";
import { query } from "@/services/notion/query";
import { QueryResponse } from "@/services/notion/types";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const response = await query();

  return {
    props: {
      response,
    },
  };
};

export default function Home({ response }: { response: QueryResponse }) {
  return (
    <>
      <Intro />
      {response && <Posts posts={response.pages} size={5} />}
    </>
  );
}

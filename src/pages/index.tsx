import { Intro } from "@/components/intro";
import { isServer } from "@/services/is_server";
import { query } from "@/services/notion/query";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await query();

  return {
    props: {
      data,
    },
  };
};

export default function Home({ data }: { data: any }) {
  if (!isServer) console.log(data);
  return (
    <>
      <Intro />
    </>
  );
}

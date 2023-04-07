import { config } from "@/config";
import { GetServerSideProps } from "next";

export default function RobotsText() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = generateRobotsText();

  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.write(content);
  res.end();

  return {
    props: {},
  };
};

const generateRobotsText = () => {
  return `User-agent: *
Disallow: /
Allow: /$
Allow: /post
Allow: /tag
Sitemap: ${`${config.baseURL}/sitemap.xml`}
 `;
};

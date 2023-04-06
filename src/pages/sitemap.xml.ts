import { config } from "@/config";
import { getAllPages } from "@/services/notion/page";
import { PageMeta } from "@/services/notion/types";
import { GetServerSideProps } from "next";

export default function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await getAllPages();
  const content = generateSitemap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(content);
  res.end();

  return {
    props: {},
  };
};

const generateSitemap = (posts: PageMeta[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${config.baseURL}</loc>
     </url>
     <url>
       <loc>${`${config.baseURL}/post`}</loc>
     </url>
     ${posts
       .map(({ path }) => {
         return `
       <url>
           <loc>${`${config.baseURL}/post/${path}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
};

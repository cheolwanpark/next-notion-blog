import { config } from "@/config";
import Head from "next/head";

export const MetaHead = ({
  title,
  description,
  url,
}: {
  title?: string;
  description?: string;
  url?: string;
}) => {
  return (
    <Head>
      <title>{title || config.blogTitle}</title>
      <meta
        name="description"
        content={description || config.defaultSiteDescription}
      />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title || config.blogTitle} />
      <meta property="og:site_name" content={config.blogTitle} />
      <meta property="og:type" content="blog" />
      <meta property="og:url" content={url || config.baseURL} />
      <meta property="og:article:author" content={config.owner} />
    </Head>
  );
};

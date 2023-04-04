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
  title = title || config.blogTitle;
  description = description || config.defaultSiteDescription;
  url = url || config.baseURL;
  const ogImageURL = `${config.baseURL}/api/og${
    title === config.blogTitle ? "" : `?title=${title}`
  }`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={config.blogTitle} />
      <meta property="og:type" content="blog" />
      <meta property="og:url" content={url} />
      <meta property="og:article:author" content={config.owner} />
      <meta property="og:image" content={ogImageURL} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </Head>
  );
};

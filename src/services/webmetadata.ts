import { Metadata } from "next";
import {
  AbsoluteString,
  AbsoluteTemplateString,
  DefaultTemplateString,
} from "next/dist/lib/metadata/types/metadata-types";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { unfurl } from "unfurl.js";
import { isString } from "./utils";

export type WebMetadata = {
  title: string | null;
  description: string | null;
  icon: string | null;
  image: string | null;
  url: string;
};

export const getMetadata = async (url: string): Promise<WebMetadata> => {
  const res = await unfurl(url, {
    oembed: true,
    timeout: 3000,
    follow: 3,
  });
  return parse(res, url);
};

const parse = (meta: Metadata, url: string): WebMetadata => {
  const og = getOpenGraph(meta);
  return {
    title: meta.title ? parseTemplateString(meta.title) : null,
    description: meta.description || null,
    icon: parseIcons(meta),
    image: og ? parseImages(og) : null,
    url,
  };
};

const getOpenGraph = (meta: Metadata) => {
  try {
    const m = meta as any;
    const og = m.open_graph as OpenGraph;
    return og;
  } catch (_) {
    return null;
  }
};

const parseTemplateString = (
  str: string | DefaultTemplateString | AbsoluteTemplateString | AbsoluteString,
) => {
  if (isString(str)) return str;
  const s = str as any;
  if (s.default !== undefined) {
    return s.default;
  } else if (s.absolute !== undefined) {
    return s.absolute;
  } else {
    return "";
  }
};

const parseIcons = (meta: Metadata) => {
  try {
    const m = meta as any;
    return m.favicon as string;
  } catch (_) {
    return null;
  }
};

const parseImages = (og: OpenGraph) => {
  const images = og.images;
  let image = null;
  if (!images) {
    return null;
  } else if (images instanceof Array) {
    if (images.length === 0) return null;
    image = images[0];
  } else {
    image = images;
  }

  if (isString(image)) return image;
  else if (image instanceof URL) return image.toString();
  else return parseURL(image.url);
};

const parseURL = (url: string | URL) => {
  if (isString(url)) return url;
  else {
    return url.toString();
  }
};

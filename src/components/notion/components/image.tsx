import {
  ImageBlockExtended,
  WithChildren,
} from "@/services/notion/types/block";
import dayjs from "dayjs";
import NextImage from "next/image";
import { useMemo } from "react";
import styles from "@/styles/notion/components.module.css";
import { RichText } from "./richtext";
import {
  GetBlockResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import useSWR from "swr";

const ImageImpl = ({
  url,
  dim,
  caption,
  unoptimized,
}: {
  url: string;
  dim: {
    width: number;
    height: number;
  };
  caption: RichTextItemResponse[];
  unoptimized?: boolean;
}) => {
  return (
    <div className={styles.image}>
      <NextImage
        src={url}
        width={dim.width}
        height={dim.height}
        alt=""
        unoptimized={unoptimized || false}
      />
      <div className={styles.caption}>
        <RichText richTexts={caption} />
      </div>
    </div>
  );
};

export const Image = ({
  block,
}: {
  block: ImageBlockExtended & WithChildren;
}) => {
  const { url, expired } = useMemo(() => getImageUrl(block), [block]);
  const {
    dim,
    image: { caption },
  } = block;
  if (!expired) {
    return <ImageImpl url={url} dim={dim} caption={caption} />;
  } else {
    const { data } = useImageBlock(block.id);
    if (data) {
      return (
        <ImageImpl
          url={getImageUrl(data).url}
          dim={dim}
          caption={caption}
          unoptimized={true}
        />
      );
    } else {
      return (
        <ImageImpl url={url} dim={dim} caption={caption} unoptimized={true} />
      );
    }
  }
};

const getImageUrl = (
  block: ImageBlockExtended,
): {
  url: string;
  expired: boolean;
} => {
  if (block.image.type === "external") {
    return {
      url: block.image.external.url,
      expired: false,
    };
  } else {
    const currentTime = dayjs.utc();
    const expiryTime = dayjs.utc(block.cacheExpiryTime).subtract(10, "seconds");
    return {
      url: block.image.file.url,
      expired: currentTime.isAfter(expiryTime),
    };
  }
};

export const useImageBlock = (id: string) => {
  const { data, isValidating, error } = useSWR<ImageBlockExtended | null>(
    [id],
    async () => {
      const res = await fetch(`/api/notion/block?id=${id}`);
      // @ts-ignore
      return res.json().block;
    },
  );

  return {
    data,
    isLoading: isValidating,
    error,
  };
};

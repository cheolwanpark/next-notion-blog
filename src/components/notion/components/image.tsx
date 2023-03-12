import {
  ImageBlockExtended,
  WithChildren,
} from "@/services/notion/types/block";
import dayjs from "dayjs";
import Image from "next/image";
import styles from "@/styles/notion/components.module.css";
import { RichText } from "./richtext";
import useSWR from "swr";
import { Spinner } from "@/components/spinner";

export const NotionImage = ({
  block,
}: {
  block: ImageBlockExtended & WithChildren;
}) => {
  const { url, renewed } = useImageUrl(block);
  if (url) {
    return (
      <div className={styles.image}>
        <Image
          src={url}
          width={block.dim.width}
          height={block.dim.height}
          alt=""
          unoptimized={renewed}
        />
        <div className={styles.caption}>
          <RichText richTexts={block.image.caption} />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={styles.image_loading}
        style={{ aspectRatio: block.dim.width / block.dim.height }}
      >
        <Spinner />
      </div>
    );
  }
};

export const useImageUrl = (block: ImageBlockExtended) => {
  const { expired } = getImageUrl(block);
  const { data, isValidating, error } = useSWR<{
    block: ImageBlockExtended;
    renewed: boolean;
  }>([block.id], async () => {
    if (expired) {
      const res = await fetch(`/api/notion/block?id=${block.id}`);
      // @ts-ignore
      return { block: (await res.json()).block, renewed: true };
    } else {
      return { block: block, renewed: false };
    }
  });
  return {
    url: isValidating || error || !data ? null : getImageUrl(data.block).url,
    renewed: data ? data.renewed : true,
  };
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

import { ExtendBlock, ImageBlockExtended } from "@/services/notion/types/block";
import Image from "next/image";
import styles from "@/styles/notion/components.module.scss";
import { RichText } from "./richtext";
import { Spinner } from "@/components/spinner";
import { useState } from "react";
import { config } from "@/config";

export const NotionImage = ({
  block,
}: {
  block: ExtendBlock<ImageBlockExtended>;
}) => {
  const { url, expiring, reload, reloading } = useImage(block);

  if (reloading) {
    return (
      <div className={styles.image}>
        <div
          className={styles.loading}
          style={{ aspectRatio: block.dim.width / block.dim.height }}
        >
          <Spinner />
        </div>
        <div className={styles.caption}>
          <RichText richTexts={block.image.caption} />
        </div>
      </div>
    );
  }

  const optimize = !expiring || config.optimizeExpiringImages;
  return (
    <div className={styles.image}>
      <Image
        src={url}
        width={block.dim.width}
        height={block.dim.height}
        alt=""
        unoptimized={!optimize}
        placeholder="blur"
        blurDataURL={block.blurDataURL}
        onError={reload}
      />
      <div className={styles.caption}>
        <RichText richTexts={block.image.caption} />
      </div>
    </div>
  );
};

const useImage = (block: ImageBlockExtended) => {
  const image = getImage(block);
  const expiring = image.expiring;
  const [url, setURL] = useState(image.url);
  const [reloading, setReloading] = useState(false);

  const reload = async () => {
    if (!image.expiring) return;

    setReloading(true);
    const res = await fetch(`/api/notion/block?id=${block.id}`);
    if (res.ok) {
      const json = await res.json();
      const reloadedImage = getImage(json.block);
      setURL(reloadedImage.url);
    }
    setReloading(false);
  };

  return { url, expiring, reload, reloading };
};

const getImage = (
  block: ImageBlockExtended,
): {
  url: string;
  expiring: boolean;
} => {
  if (block.image.type === "external") {
    return {
      url: block.image.external.url,
      expiring: false,
    };
  } else {
    return {
      url: block.image.file.url,
      expiring: true,
    };
  }
};

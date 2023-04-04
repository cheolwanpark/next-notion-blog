import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { siteConfig } from "../../../site.config";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL("../../../public/NotoSerifKR.otf", import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  try {
    const fontData = await font;
    const { searchParams } = new URL(req.url);

    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : siteConfig.defaultSiteDescription;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "rgb(245, 245, 245)",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            alt="BlogIcon"
            height={300}
            src={`${siteConfig.baseURL}/favicon-highres.png`}
            width={300}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              fontFamily: "NotoSerifKR",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "#415462",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
              marginLeft: 70,
              maxWidth: 600,
            }}
          >
            <div style={{ fontSize: 70 }}>{siteConfig.blogTitle}</div>
            <div style={{ fontSize: 28, marginTop: 14 }}>{title}</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "NotoSerifKR",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

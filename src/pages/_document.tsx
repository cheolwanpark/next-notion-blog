import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          id="prevent-flash"
          src="/preventFlash.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body className="body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import "@/styles/picocss.scss";
import "katex/dist/katex.min.css";
import "@/styles/globals.scss";
import "@/styles/picocustom.scss";
import type { AppProps } from "next/app";
import { Navigation } from "@/components/navigation";
import { DarkModeContext } from "@/services/darkmode";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import "@/services/dayjs";
import { Analytics } from "@vercel/analytics/react";
import classNames from "classnames";
import { NotoSansKR } from "@/services/font";
import { WebVitals } from "@/components/web-vitals";

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, _setMode] = useState<boolean | null>(null);

  const setMode = (val: boolean) => {
    _setMode(val);
    const theme = val ? "dark" : "light";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("mode", theme);
  };

  useEffect(() => {
    const bodyTheme = document.body.getAttribute("data-theme");
    const isBodyDarkTheme = bodyTheme !== null && bodyTheme === "dark";
    setMode(isBodyDarkTheme);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setMode(event.matches);
      });
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setMode }}>
      <div className={NotoSansKR.className}>
        <WebVitals />
        <Navigation />
        <main className={classNames("container", "main")}>
          <Component {...pageProps} />
        </main>
        <Footer />
        <Analytics />
      </div>
    </DarkModeContext.Provider>
  );
}

import "@picocss/pico/css/pico.min.css";
import "katex/dist/katex.min.css";
import "@/styles/globals.css";
import "@/styles/picocustom.css";
import type { AppProps } from "next/app";
import { Navigation } from "@/components/navigation";
import { DarkModeContext } from "@/services/darkmode";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import "@/services/dayjs";
import { Analytics } from "@vercel/analytics/react";

const ITEM_NAME = "mode";
const DARK = "dark";
const LIGHT = "light";

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, _setMode] = useState<boolean | null>(null);

  const setMode = (val: boolean) => {
    _setMode(val);
    localStorage.setItem(ITEM_NAME, val ? DARK : LIGHT);
  };

  useEffect(() => {
    setMode(haveSetDarkMode());
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        setMode(event.matches);
      });
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setMode }}>
      <div
        className="screen"
        data-theme={
          isDarkMode !== null ? (isDarkMode ? DARK : LIGHT) : undefined
        }
      >
        <Navigation />
        <main className="container main">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      <Analytics />
    </DarkModeContext.Provider>
  );
}

const haveSetDarkMode = () => {
  if (!localStorage.getItem(ITEM_NAME)) {
    return isPreferColorSchemeIsDark();
  }
  return localStorage.getItem(ITEM_NAME) === DARK;
};

const isPreferColorSchemeIsDark = () => {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

import "@picocss/pico/css/pico.min.css";
import "@/styles/globals.css";
import "@/styles/picocustom.css";
import type { AppProps } from "next/app";
import { Navigation } from "@/components/navigation";
import { DarkModeContext } from "@/services/darkmode";
import { useState } from "react";
import { Footer } from "@/components/footer";
import "@/services/dayjs";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setMode }}>
      <div className="screen" data-theme={isDarkMode ? "dark" : "light"}>
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

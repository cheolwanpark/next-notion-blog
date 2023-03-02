import "@/styles/globals.css";
import "@/styles/nopico.css";
import "@picocss/pico/css/pico.min.css";
import type { AppProps } from "next/app";
import { Navigation } from "@/components/navigation";
import { DarkModeContext } from "@/services/darkmode";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setMode }}>
      <div className="screen" data-theme={isDarkMode ? "dark" : "light"}>
        <Navigation />
        <main className="container">
          <Component {...pageProps} />
        </main>
      </div>
    </DarkModeContext.Provider>
  );
}

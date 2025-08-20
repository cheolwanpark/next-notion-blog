import "@/styles/picocss.scss"
import "katex/dist/katex.min.css"
import "@/styles/globals.scss"
import "@/styles/picocustom.scss"
import "@/services/dayjs"

import { Analytics } from "@vercel/analytics/react"
import classNames from "classnames"
import Script from "next/script"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WebVitals } from "@/components/web-vitals"
import { DarkModeProvider } from "@/components/providers"
import { NotoSansKR } from "@/services/font"
import { config } from "@/config"

export const metadata = {
  title: {
    default: config.blogTitle,
    template: `%s | ${config.blogTitle}`,
  },
  description: config.defaultSiteDescription,
  keywords: ["blog", "programming", "development", "tech"],
  authors: [{ name: config.owner }],
  creator: config.owner,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: config.baseURL,
    title: config.blogTitle,
    description: config.defaultSiteDescription,
    siteName: config.blogTitle,
  },
  twitter: {
    card: "summary_large_image",
    title: config.blogTitle,
    description: config.defaultSiteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: config.googleSiteVerificationMetaTag,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="ko" className={NotoSansKR.className} suppressHydrationWarning>
      <head>
        <Script
          id="prevent-flash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getDarkMode() {
                  var stored = localStorage.getItem("mode");
                  if (stored) {
                    return stored === "dark";
                  }
                  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                }
                
                var isDark = getDarkMode();
                var theme = isDark ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", theme);
              })();
            `,
          }}
        />
      </head>
      <body className="body" suppressHydrationWarning>
        <DarkModeProvider>
          <div className={NotoSansKR.className}>
            <WebVitals />
            <Navigation />
            <main className={classNames("container", "main")}>
              {children}
            </main>
            <Footer />
            <Analytics />
          </div>
        </DarkModeProvider>
      </body>
    </html>
  )
}
import "@/styles/picocss.scss"
import "katex/dist/katex.min.css"
import "@/styles/globals.scss"
import "@/styles/picocustom.scss"
import "@/services/dayjs"

import { Analytics } from "@vercel/analytics/react"
import classNames from "classnames"
import { cookies } from "next/headers"
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get theme from cookies for server-side rendering
  const cookieStore = await cookies()
  const theme = cookieStore.get("theme")?.value || "light"

  return (
    <html lang="ko" className={NotoSansKR.className} data-theme={theme}>
      <head>
        <Script
          id="prevent-flash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function isPreferColorSchemeIsDark() {
                return (
                  window.matchMedia &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                );
              }
              function haveSetDarkMode() {
                const theme = document.cookie
                  .split('; ')
                  .find(row => row.startsWith('theme='))
                  ?.split('=')[1];
                if (!theme && !localStorage.getItem("mode")) {
                  return isPreferColorSchemeIsDark();
                }
                return (theme || localStorage.getItem("mode")) === "dark";
              }
              if (haveSetDarkMode()) {
                if (document.documentElement.getAttribute("data-theme") !== "dark") {
                  document.documentElement.setAttribute("data-theme", "dark");
                }
                if (document.body.getAttribute("data-theme") !== "dark") {
                  document.body.setAttribute("data-theme", "dark");
                }
              } else {
                if (document.documentElement.getAttribute("data-theme") !== "light") {
                  document.documentElement.setAttribute("data-theme", "light");
                }
                if (document.body.getAttribute("data-theme") !== "light") {
                  document.body.setAttribute("data-theme", "light");
                }
              }
            `,
          }}
        />
      </head>
      <body className="body" data-theme={theme}>
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
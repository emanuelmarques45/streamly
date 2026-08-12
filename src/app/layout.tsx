import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Providers from "@/utils/providers";
import { SITE_URL } from "@/lib/siteUrl";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Streamly — filmes e séries",
    template: "%s · Streamly",
  },
  description:
    "Explore filmes e séries, veja elenco, trailers e temporadas, e monte sua lista de favoritos. Dados fornecidos pelo TMDB.",
  applicationName: "Streamly",
  openGraph: {
    type: "website",
    siteName: "Streamly",
    title: "Streamly — filmes e séries",
    description:
      "Explore filmes e séries, veja elenco, trailers e temporadas, e monte sua lista de favoritos.",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

/**
 * Applies the theme before the first paint. Without this the page flashed light
 * for an instant before React swapped the class.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' className='h-full' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans flex min-h-full flex-col`}
      >
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white'
        >
          Pular para o conteúdo
        </a>

        <Providers>
          <Header />
          <main id='main-content' className='flex-1 py-4'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

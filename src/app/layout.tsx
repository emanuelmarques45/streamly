import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Providers from "@/utils/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.APP_URL ?? "http://localhost:5173";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
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
 * Aplica o tema antes da primeira pintura. Sem isso a página aparecia clara
 * por um instante antes do React trocar a classe.
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
          href='#conteudo'
          className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white'
        >
          Pular para o conteúdo
        </a>

        <Providers>
          <Header />
          <main id='conteudo' className='flex-1 py-4'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

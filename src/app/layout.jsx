import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "@/components/auth/Providers";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
import { Suspense } from "react";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Drawing Gallery - Free Printable Coloring Pages & Drawing Tutorials",
  description: "Download thousands of free printable coloring pages and watch step-by-step drawing tutorials on our YouTube channel. Perfect for kids, adults, and art enthusiasts of all skill levels.",
  keywords: "free coloring pages, printable coloring sheets, drawing tutorials, YouTube art channel, kids coloring pages, adult coloring books, step by step drawing, art lessons, creative activities",
  authors: [{ name: "Drawing Gallery" }],
  creator: "Drawing Gallery YouTube Channel",
  publisher: "Drawing Gallery",
  robots: "index, follow",
  openGraph: {
    title: "Drawing Gallery - Free Printable Coloring Pages & Drawing Tutorials",
    description: "Download thousands of free printable coloring pages and watch step-by-step drawing tutorials on our YouTube channel.",
    url: "https://drawing-gallery.com",
    siteName: "Drawing Gallery",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drawing Gallery - Free Printable Coloring Pages & Drawing Tutorials",
    description: "Download thousands of free printable coloring pages and watch step-by-step drawing tutorials on our YouTube channel.",
    creator: "@Drawing-Gallery"
  },
  alternates: {
    canonical: "https://drawing-gallery.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6646869679028637"
          crossOrigin="anonymous"
        ></script>
        
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-LJ94ZJP17C'}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-LJ94ZJP17C'}');
            `,
          }}
        />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Drawing Gallery",
              "description": "Free printable coloring pages and drawing tutorials YouTube channel",
              "url": "https://drawing-gallery.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://drawing-gallery.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://youtube.com/@Drawing-Gallery",
              ]
            }),
          }}
        />
      </head>
      <body className={`${outfit.variable}`}>
        <Providers>
        <Suspense fallback={null}>
          <ThemeProvider>
            <AuthProvider>
              <SidebarProvider>
                <GoogleAnalytics />
                {children}
              </SidebarProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        </Providers>
      </body>
    </html>
  );
}
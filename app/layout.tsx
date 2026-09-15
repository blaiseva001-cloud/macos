/* ═══════════════════════════════════════════════════════════════════════════
   KOICA Detective OS — Root Layout (Titanium Ultra Edition)
   Premium · SEO-complete · font-optimized · anti-flash · cache-ready
   ═══════════════════════════════════════════════════════════════════════════ */
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* ── Fonts — self-hosted, subset, swapped, preloaded ────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "system-ui", "sans-serif"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/* ── Canonical URL — set NEXT_PUBLIC_SITE_URL in your .env ─────────────── */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://koica-macos.vercel.app";

const TITLE = "KOICA Detective OS";
const DESCRIPTION =
  "WeKO@KOICA — an interactive macOS-style investigation environment exploring KOICA's global development cooperation. Terminal shell, world atlas, case board, PDF viewer, and live widgets.";

/* ── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${TITLE}`,
  },
  description: DESCRIPTION,
  applicationName: TITLE,
  generator: "Next.js",
  keywords: [
    "KOICA", "Korea International Cooperation Agency",
    "development cooperation", "macOS", "web OS", "detective OS",
    "investigation", "atlas", "terminal", "WeKO", "case board",
  ],
  authors: [{ name: "WeKO", url: SITE_URL }],
  creator: "WeKO",
  publisher: "WeKO",
  category: "technology",
  classification: "Interactive Demo",
  referrer: "origin-when-cross-origin",

  /* Icons — every device, every size */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon_io/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon_io/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon_io/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon_io/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/favicon_io/site.webmanifest",

  /* Apple & PWA niceties */
  appleWebApp: {
    capable: true,
    title: "KOICA OS",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  /* OpenGraph */
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "KOICA Detective OS",
      },
    ],
  },

  /* Twitter */
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/favicon_io/android-chrome-512x512.png"],
    creator: "@weko",
  },

  /* SEO */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },

  /* Prevent phone-number autolinking in the terminal, etc. */
  other: {
    "msapplication-TileColor": "#0b0a14",
    "msapplication-config": "none",
    "color-scheme": "dark light",
  },
};

/* ── Viewport — separate export in Next 14+ ─────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",          // iOS notch / Dynamic Island
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0b0a14" },
    { media: "(prefers-color-scheme: light)", color: "#0b0a14" },
  ],
  colorScheme: "dark light",
};

/* ── Anti-flash theme init — runs before paint ──────────────────────────── */
const THEME_INIT = `
(function(){
  try {
    var stored = localStorage.getItem('weko.theme');
    // App defaults to dark; only override if user explicitly chose light.
    var dark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    document.documentElement.style.backgroundColor = '#0b0a14';
  } catch (_) {}
})();
`;

/* ── Root layout ────────────────────────────────────────────────────────── */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        {/* Anti-flash: runs synchronously before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />

        {/* Preconnect for external resources the app actually hits */}
        <link rel="preconnect" href="https://hrafnbkqaustrncotdlu.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://en.wikipedia.org" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />

        {/* iOS PWA meta (belt-and-braces alongside appleWebApp) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="KOICA OS" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body
        className={`${inter.className} min-h-full flex flex-col bg-[#0b0a14] text-white selection:bg-sky-500/40 selection:text-white`}
        style={{
          // Prevent rubber-band & pull-to-refresh on mobile OS
          overscrollBehavior: "none",
          WebkitTapHighlightColor: "transparent",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}
      >
        {children}

        {/* JSON-LD: Organization schema for richer search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: TITLE,
              description: DESCRIPTION,
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript. Requires HTML5.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: {
                "@type": "Organization",
                name: "KOICA",
                alternateName: "Korea International Cooperation Agency",
                url: "https://www.koica.go.kr",
              },
              author: { "@type": "Person", name: "WeKO" },
            }),
          }}
        />
      </body>
    </html>
  );
}

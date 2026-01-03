import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Chibi Avatar Creator",
  description: "Convert your photos into cute 3D stylized characters inspired by the provided reference style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-style-ready="false" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800;900&display=swap"
        />
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
          id="tailwind-cdn"
        />
        <style>{`
          :root {
            background: #ffffff;
            color: #0f172a;
            font-family: 'Onest', system-ui, -apple-system, 'Segoe UI', sans-serif;
          }
          body {
            margin: 0;
            background: #ffffff;
            min-height: 100vh;
          }
          #__next {
            opacity: 0;
          }
          [data-style-ready="true"] #__next {
            opacity: 1;
          }
          #app-style-loader {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 12px;
            background: #ffffff;
            z-index: 9999;
            transition: opacity 180ms ease-out, visibility 180ms ease-out;
          }
          #app-style-loader .spinner {
            width: 64px;
            height: 64px;
            border-radius: 999px;
            border: 5px solid #e5e7eb;
            border-top-color: #f97316;
            animation: app-style-spin 0.8s linear infinite;
          }
          #app-style-loader .label {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #0f172a;
          }
          @keyframes app-style-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          [data-style-ready="true"] #app-style-loader {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
          @media (prefers-reduced-motion: no-preference) {
            #__next { transition: opacity 160ms ease-out; }
          }
        `}</style>
        <Script id="gate-styles" strategy="beforeInteractive">{`
          (function gateStyles() {
            // Only gate the homepage; allow secondary pages to render immediately.
            if (typeof window !== 'undefined' && window.location && window.location.pathname !== '/') {
              document.documentElement.setAttribute('data-style-ready', 'true');
              document.body && document.body.setAttribute('data-style-ready', 'true');
              return;
            }

            var markReady = function () {
              document.documentElement.setAttribute('data-style-ready', 'true');
              document.body && document.body.setAttribute('data-style-ready', 'true');
            };

            var waitFor = [];
            var tailwindScript = document.getElementById('tailwind-cdn');
            if (tailwindScript) {
              var twReady = function (el) {
                return el.readyState === 'complete' || el.readyState === 'loaded';
              };
              waitFor.push(new Promise(function (resolve) {
                if (twReady(tailwindScript)) return resolve(null);
                tailwindScript.addEventListener('load', resolve, { once: true });
                tailwindScript.addEventListener('error', resolve, { once: true });
              }));
            }

            if (waitFor.length) {
              Promise.all(waitFor).then(function () {
                requestAnimationFrame(function () {
                  requestAnimationFrame(markReady);
                });
              });
            } else {
              markReady();
            }

            setTimeout(markReady, 500);
          })();
        `}</Script>
      </head>
      <body className="bg-gray-50 min-h-screen font-[Onest]" data-style-ready="false" suppressHydrationWarning>
        <div id="app-style-loader" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
        </div>
        {children}
      </body>
    </html>
  );
}

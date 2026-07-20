import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
 return (
  <Html lang="en">
   <Head>
    <meta charSet="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

    <link rel="icon" href="/favicon.png" />
   </Head>
   <body>
    <Main />
    <NextScript />
   </body>
  </Html>
 )
}


import '../src/index.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
 return (
  <>
   <Head>
    <title>Haresh Murugesan | Portfolio</title>
    <meta
     name="description"
     content="Portfolio of Haresh Murugesan — Building computer vision and cloud-native tools."
    />
    <meta
     name="keywords"
     content="Haresh Murugesan, portfolio, software engineer, web developer, react, AI, machine learning"
    />
    <meta name="author" content="Haresh Murugesan" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://hareshmurugesan.com" />

    {/* Open Graph (for social media preview) */}
    <meta property="og:title" content="Haresh Murugesan | Developer Portfolio" />
    <meta
     property="og:description"
     content="Explore Haresh's creative and technical projects, podcasts, and tech insights."
    />
    <meta property="og:image" content="https://hareshmurugesan.com/preview-image.png" />
    <meta property="og:url" content="https://hareshmurugesan.com" />
    <meta property="og:type" content="website" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Haresh Murugesan | Developer Portfolio" />
    <meta
     name="twitter:description"
     content="Explore Haresh's creative and technical projects, podcasts, and tech insights."
    />
    <meta name="twitter:image" content="https://hareshmurugesan.com/preview-image.png" />
   </Head>
   <Component {...pageProps} />
  </>
 )
}


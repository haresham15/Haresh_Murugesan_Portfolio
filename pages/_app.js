import '../src/index.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
 return (
  <>
   <Head>
    <title>Haresh Murugesan | Portfolio</title>
    <meta
     name="description"
     content="Portfolio of Haresh Murugesan — Full-Stack & AI Engineer at Ohio State. Building explainable vision, real-time simulation engines, and human-centered systems."
    />
    <meta
     name="keywords"
     content="Haresh Murugesan, portfolio, software engineer, machine learning, computer vision, nextjs, react, python, fastapi, typescript"
    />
    <meta name="author" content="Haresh Murugesan" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://hareshmurugesan.com" />

    {/* Open Graph (for social media preview) */}
    <meta property="og:title" content="Haresh Murugesan | Software & AI Engineer" />
    <meta
     property="og:description"
     content="Explore Haresh's engineering systems, explainable AI research, and technical case studies."
    />
    <meta property="og:image" content="https://hareshmurugesan.com/preview-image.jpeg" />
    <meta property="og:url" content="https://hareshmurugesan.com" />
    <meta property="og:type" content="website" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Haresh Murugesan | Software & AI Engineer" />
    <meta name="twitter:description" content="Portfolio of Haresh Murugesan — CS & AI at Ohio State. Featured systems: Healios V2, Apexis, Tempo." />
    <meta name="twitter:image" content="https://hareshmurugesan.com/preview-image.jpeg" />
   </Head>
   <Component {...pageProps} />
  </>
 )
}

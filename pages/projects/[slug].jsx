import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { spotlightProjects } from '../../src/data/projects';
import FractalGlassBackground from '../../src/components/FractalGlassBackground';
import Header from '../../src/components/Header';

export default function ProjectCaseStudy({ project }) {
  if (!project) {
    return <div className="text-white p-20">Project not found</div>;
  }

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-[#050505]">
      <Head>
        <title>{project.title} | Case Study</title>
      </Head>
      
      <FractalGlassBackground />
      <Header />

      <main className="w-full max-w-4xl mx-auto px-4 py-32 relative z-10">
        <Link 
          href="/#projects"
          className="text-light-gray/60 hover:text-neon-cyan font-mono text-sm mb-8 inline-block transition-colors"
        >
          ← Back to Projects
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tight text-white mb-6">
            {project.title}
          </h1>
          
          <div className="flex gap-4 mb-12">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="text-neon-cyan hover:text-white font-mono border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 rounded-full transition-colors">
                GitHub Repository
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="text-neon-purple hover:text-white font-mono border border-neon-purple/30 bg-neon-purple/10 px-4 py-2 rounded-full transition-colors">
                Live Demo
              </a>
            )}
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-12 shadow-lg shadow-black/50">
            <h2 className="text-2xl font-mono font-bold text-white mb-4">Executive Summary</h2>
            <p className="text-light-gray/80 font-sans leading-relaxed text-lg">
              {project.description}
            </p>
          </div>

          <div className="space-y-12">
            {/* The Narrative */}
            <section>
              <h3 className="text-xl font-mono font-bold text-neon-cyan mb-4 flex items-center gap-2">
                <span className="text-2xl">01.</span> The Problem
              </h3>
              <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10">
                {project.slug === 'healios' && "Standard post-surgical recovery relies heavily on infrequent in-person visits. Patients often misidentify early signs of infection, leading to readmissions. Existing computer vision solutions used rudimentary edge detection, which failed on varied skin tones and complex wound topologies."}
                {project.slug === 'ai-motorsports-hub' && "Motorsports teams and enthusiasts lack accessible, unified dashboards for real-time telemetry. Aggregating 20+ F1 session data streams usually requires expensive enterprise software, and rendering this data on the web often results in severe latency issues."}
                {project.slug === 'routerx' && "During DataFest 2026, our team was tasked with analyzing raw, unstructured data regarding healthcare accessibility. The core problem was identifying and quantifying 'healthcare deserts'—regions where critical medication delivery fails due to inefficient routing and lack of infrastructure."}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-mono font-bold text-neon-cyan mb-4 flex items-center gap-2">
                <span className="text-2xl">02.</span> The Approach & Architecture
              </h3>
              <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10 mb-6">
                {project.slug === 'healios' && "I shifted from standard edge detection to leveraging a fine-tuned Segment Anything Model (SAM). By running inference in the cloud and optimizing the tensor operations, the model can accurately segment wheals and wound boundaries."}
                {project.slug === 'ai-motorsports-hub' && "I adopted a hybrid-cloud architecture to balance cost, speed, and complexity. The OpenF1 API feeds into AWS Lambda for initial processing, which stores historical aggregates in S3 and live state in Supabase, finally served to a Vercel frontend."}
                {project.slug === 'routerx' && "We utilized a graph-based routing algorithm combined with spatial data analysis (GeoPandas). We extracted millions of data points into a directed graph, weighting edges by transit time and historical failure rates, then visualized the optimized routes via a React frontend."}
              </p>
              
              {/* Architecture Diagram (CSS-based for recruiter visibility without images) */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-6 font-mono text-sm overflow-x-auto ml-8">
                {project.slug === 'ai-motorsports-hub' && (
                  <div className="flex items-center gap-4 min-w-[600px] text-center">
                    <div className="bg-white/5 p-3 rounded border border-white/20">OpenF1 API<br/><span className="text-xs text-gray-500">Raw Data</span></div>
                    <div className="text-neon-cyan">→</div>
                    <div className="bg-white/5 p-3 rounded border border-white/20">AWS Lambda<br/><span className="text-xs text-gray-500">Processing</span></div>
                    <div className="text-neon-cyan">→</div>
                    <div className="flex flex-col gap-2">
                      <div className="bg-white/5 p-3 rounded border border-white/20">Supabase<br/><span className="text-xs text-gray-500">Live State</span></div>
                      <div className="bg-white/5 p-3 rounded border border-white/20">Amazon S3<br/><span className="text-xs text-gray-500">Cold Storage</span></div>
                    </div>
                    <div className="text-neon-cyan">→</div>
                    <div className="bg-white/5 p-3 rounded border border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)]">Next.js / Vercel<br/><span className="text-xs">Client UI</span></div>
                  </div>
                )}
                {project.slug === 'healios' && (
                  <div className="flex items-center gap-4 min-w-[600px] text-center">
                    <div className="bg-white/5 p-3 rounded border border-white/20">Client App<br/><span className="text-xs text-gray-500">Image Capture</span></div>
                    <div className="text-neon-purple">→</div>
                    <div className="bg-white/5 p-3 rounded border border-white/20">FastAPI Backend<br/><span className="text-xs text-gray-500">Preprocessing</span></div>
                    <div className="text-neon-purple">→</div>
                    <div className="bg-white/5 p-3 rounded border border-neon-purple/50 text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.2)]">Fine-Tuned SAM<br/><span className="text-xs">Inference (GPU)</span></div>
                    <div className="text-neon-purple">→</div>
                    <div className="bg-white/5 p-3 rounded border border-white/20">Post-Processing<br/><span className="text-xs text-gray-500">Risk Scoring</span></div>
                  </div>
                )}
                {project.slug === 'routerx' && (
                  <div className="flex items-center gap-4 min-w-[600px] text-center">
                    <div className="bg-white/5 p-3 rounded border border-white/20">Raw Data<br/><span className="text-xs text-gray-500">CSV/JSON</span></div>
                    <div className="text-neon-cyan">→</div>
                    <div className="bg-white/5 p-3 rounded border border-white/20">GeoPandas<br/><span className="text-xs text-gray-500">Spatial Parse</span></div>
                    <div className="text-neon-cyan">→</div>
                    <div className="bg-white/5 p-3 rounded border border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.2)]">Dijkstra / A*<br/><span className="text-xs">Graph Routing</span></div>
                    <div className="text-neon-cyan">→</div>
                    <div className="bg-white/5 p-3 rounded border border-white/20">React Dashboard<br/><span className="text-xs text-gray-500">Visualization</span></div>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-mono font-bold text-neon-cyan mb-4 flex items-center gap-2">
                <span className="text-2xl">03.</span> Tradeoffs
              </h3>
              <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10">
                {project.slug === 'healios' && "Using SAM drastically increased accuracy but introduced heavy inference latency compared to simple OpenCV scripts. I mitigated this by aggressive image downsampling before inference, trading a negligible 1% accuracy drop for a 3x speedup."}
                {project.slug === 'ai-motorsports-hub' && "Using a hybrid cloud (AWS + Supabase + Vercel) increased operational complexity and deployment friction. I could have built a monolith on a single VPS, but the hybrid approach allowed me to leverage generous free tiers and scale specific microservices independently."}
                {project.slug === 'routerx' && "Processing millions of geospatial data points entirely in Python caused memory bottlenecks on our laptops during the 48-hour hackathon. We opted to heavily pre-filter and aggregate the data into regional bounding boxes before rendering, sacrificing micro-level detail for macro-level performance."}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-mono font-bold text-neon-cyan mb-4 flex items-center gap-2">
                <span className="text-2xl">04.</span> The Messy Part & Next Steps
              </h3>
              <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10">
                {project.slug === 'healios' && "The model currently struggles with severe lighting variations and extreme shadows, causing false positives in edge detection. Next iteration involves data augmentation with simulated lighting conditions and implementing a pre-processing histogram equalization step."}
                {project.slug === 'ai-motorsports-hub' && "Websocket connection drops during high-volume telemetry spikes are currently causing UI stuttering. I'm actively researching Redis pub/sub implementations to buffer the stream and smooth out the delivery to the client."}
                {project.slug === 'routerx' && "The UI feels a bit static since the routing happens on the backend. I'm currently working on open-sourcing the data processing pipeline so others can visualize their own city's data interactively within the browser using WebGL."}
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = spotlightProjects
    .filter(p => p.slug)
    .map((p) => ({
      params: { slug: p.slug },
    }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = spotlightProjects.find((p) => p.slug === params.slug);
  return { props: { project: project || null } };
}

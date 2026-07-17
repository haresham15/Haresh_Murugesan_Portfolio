import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FractalGlassBackground from '../../src/components/FractalGlassBackground';
import Header from '../../src/components/Header';

export default function MotorsportsPRD() {
 return (
  <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-[#050505]">
   <Head>
    <title>Motorsports AI Hub | PRD</title>
   </Head>
   
   <FractalGlassBackground />
   <Header />

   <main className="w-full max-w-4xl mx-auto px-4 py-32 relative z-10">
    <Link 
     href="/"
     className="text-light-gray/60 hover:text-cine-teal font-sans tracking-widest uppercase text-sm mb-8 inline-block transition-colors"
    >
     ← Back to Portfolio
    </Link>

    <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
    >
     <div className="mb-4 text-cine-teal font-sans tracking-widest uppercase text-sm uppercase tracking-widest">
      Product Requirements Document
     </div>
     <h1 className="text-4xl md:text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-white mb-6">
      Motorsports AI Management System
     </h1>
     
     <div className="flex gap-4 mb-12">
      <span className="text-light-gray/60 font-sans tracking-widest uppercase text-sm border border-white/10 bg-white/5 px-3 py-1 rounded">Status: In Development</span>
      <span className="text-light-gray/60 font-sans tracking-widest uppercase text-sm border border-white/10 bg-white/5 px-3 py-1 rounded">Author: Haresh Murugesan</span>
     </div>

     <div className="space-y-12 font-sans">
      <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg shadow-black/50">
       <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-white mb-4">1. Executive Summary</h2>
       <p className="text-light-gray/80 leading-relaxed text-lg">
        The Motorsports AI Management System is a centralized, real-time data hub designed to aggregate, analyze, and visualize live telemetry and historical race data across multiple racing disciplines (F1, F2, F3, FE, GTWC, NASCAR). By leveraging machine learning models alongside the OpenF1 API, the platform provides predictive insights, optimal pit-window calculations, and real-time tire degradation analysis for racing enthusiasts and engineering teams.
       </p>
      </section>

      <section>
       <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4">2. Objectives & Success Metrics</h2>
       <ul className="list-disc list-inside space-y-3 text-light-gray/80 pl-4 border-l border-white/10">
        <li><strong className="text-white">Latency:</strong> Sub-500ms end-to-end latency from OpenF1 API fetch to client UI render via Supabase Realtime.</li>
        <li><strong className="text-white">Data Integration:</strong> Seamlessly aggregate 20+ distinct data streams (weather, telemetry, sector times, driver audio) into a unified schema.</li>
        <li><strong className="text-white">Predictive Accuracy:</strong> Machine learning models must predict tire degradation cliff-points within a 2-lap margin of error.</li>
       </ul>
      </section>

      <section>
       <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4">3. System Architecture</h2>
       <p className="text-light-gray/80 mb-6 leading-relaxed">
        A hybrid-cloud approach is utilized to balance the massive data ingestion requirements with cost-effective cold storage and lightning-fast client delivery.
       </p>
       
       <div className="bg-black/60 border border-white/10 rounded-xl p-6 font-sans tracking-widest uppercase text-sm overflow-x-auto">
        <div className="flex flex-col gap-6 min-w-[700px]">
         {/* Data Ingestion */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-light-gray/60">Data Ingestion</div>
          <div className="text-cine-teal">→</div>
          <div className="bg-white/5 p-3 rounded border border-white/20 flex-1">
           <strong>OpenF1 API & Official Timing Feeds</strong> (Polling at 10Hz)
          </div>
         </div>
         {/* Processing Layer */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-light-gray/60">Processing Layer</div>
          <div className="text-cine-teal">→</div>
          <div className="bg-white/5 p-3 rounded border border-white/20 flex-1">
           <strong>AWS Lambda & Python (Pandas/NumPy)</strong> (Cleansing, anomaly detection, predictive inference via Gemini/TensorFlow)
          </div>
         </div>
         {/* Storage Layer */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-light-gray/60">Storage Layer</div>
          <div className="text-cine-teal">→</div>
          <div className="flex gap-4 flex-1">
           <div className="bg-white/5 p-3 rounded border border-white/20 w-1/2">
            <strong>Supabase (PostgreSQL)</strong><br/><span className="text-xs text-gray-500">Live State & Realtime Subscriptions</span>
           </div>
           <div className="bg-white/5 p-3 rounded border border-white/20 w-1/2">
            <strong>Amazon S3</strong><br/><span className="text-xs text-gray-500">Historical Race Parquet Files</span>
           </div>
          </div>
         </div>
         {/* Client UI */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-light-gray/60">Client Application</div>
          <div className="text-cine-teal">→</div>
          <div className="bg-white/5 p-3 rounded border border-cine-teal/50 text-cine-teal shadow-2xl flex-1">
           <strong>Next.js + Tailwind + Tremor</strong> (Hosted on Vercel)
          </div>
         </div>
        </div>
       </div>
      </section>

      <section>
       <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4">4. Core Features & Epics</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
         <h3 className="text-lg font-sans tracking-widest uppercase font-bold text-white mb-2">Live Race Command Center</h3>
         <p className="text-light-gray/70 text-sm">A real-time dashboard visualizing driver positions, sector times, and intervals. Includes a dynamic track map powered by GPS telemetry.</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
         <h3 className="text-lg font-sans tracking-widest uppercase font-bold text-white mb-2">AI Strategy Oracle</h3>
         <p className="text-light-gray/70 text-sm">Predicts optimal pit windows and under-cut probabilities by analyzing live tire degradation data against historical track surface models.</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
         <h3 className="text-lg font-sans tracking-widest uppercase font-bold text-white mb-2">Radio Transcription Engine</h3>
         <p className="text-light-gray/70 text-sm">Real-time speech-to-text processing of driver radios to perform sentiment analysis (e.g., detecting driver frustration regarding car balance).</p>
        </div>
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
         <h3 className="text-lg font-sans tracking-widest uppercase font-bold text-white mb-2">Multi-Discipline Database</h3>
         <p className="text-light-gray/70 text-sm">A unified GraphQL schema allowing engineers to query lap data seamlessly across F1, F2, F3, Formula E, and NASCAR without writing separate API adapters.</p>
        </div>
       </div>
      </section>
     </div>
    </motion.div>
   </main>
  </div>
 );
}

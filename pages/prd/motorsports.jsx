import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ForgedCarbonCanvas from '../../src/components/ForgedCarbonCanvas';
import Header from '../../src/components/Header';
import ContactFooter from '../../src/components/ContactFooter';

export default function MotorsportsPRD() {
 return (
  <div className="w-full min-h-screen text-[#F4F6F9] overflow-x-hidden relative bg-[#03050A] selection:bg-[#FF2800] selection:text-[#03050A]">
   <Head>
    <title>Motorsports AI Hub | PRD</title>
   </Head>
   
   <ForgedCarbonCanvas />
   <Header />

   <main className="w-full max-w-4xl mx-auto px-4 py-32 relative z-10">
    <Link 
     href="/" 
     className="text-[#7E8B9B] hover:text-[#FF2800] font-mono text-xs sm:text-sm font-medium mb-8 inline-block transition-colors"
    >
     ← Back to Portfolio
    </Link>

    <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
     <div className="mb-4 text-[#FF2800] font-mono text-xs tracking-wider uppercase">
      Product Requirements Document
     </div>
     <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-[#F4F6F9] mb-6">
      Motorsports AI Management System
     </h1>
     
     <div className="flex gap-4 mb-12">
      <span className="text-[#7E8B9B] font-mono text-xs border border-[#18458B]/30 bg-[#060A12] px-3 py-1 rounded-[2px]">Status: In Development</span>
      <span className="text-[#7E8B9B] font-mono text-xs border border-[#18458B]/30 bg-[#060A12] px-3 py-1 rounded-[2px]">Author: Haresh Murugesan</span>
     </div>

     <div className="space-y-12 font-sans">
      <section className="bg-[#060A12]/85 backdrop-blur-md border border-[#18458B]/25 rounded-[2px] p-8 shadow-2xl">
       <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#F4F6F9] mb-4 tracking-tight">1. Executive Summary</h2>
       <p className="text-[#7E8B9B] leading-relaxed text-base sm:text-lg">
        The Motorsports AI Management System is a centralized, real-time data hub designed to aggregate, analyze, and visualize live telemetry and historical race data across multiple racing disciplines (F1, F2, F3, FE, GTWC, NASCAR). By leveraging machine learning models alongside the OpenF1 API, the platform provides predictive insights, optimal pit-window calculations, and real-time tire degradation analysis for racing enthusiasts and engineering teams.
       </p>
      </section>

      <section>
       <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#FF2800] mb-4 tracking-tight">2. Objectives &amp; Success Metrics</h2>
       <ul className="list-disc list-inside space-y-3 text-[#7E8B9B] pl-4 border-l border-[#18458B]/25 text-sm sm:text-base">
        <li><strong className="text-[#F4F6F9]">Latency:</strong> Sub-500ms end-to-end latency from OpenF1 API fetch to client UI render via Supabase Realtime.</li>
        <li><strong className="text-[#F4F6F9]">Data Integration:</strong> Seamlessly aggregate 20+ distinct data streams (weather, telemetry, sector times, driver audio) into a unified schema.</li>
        <li><strong className="text-[#F4F6F9]">Predictive Accuracy:</strong> Machine learning models must predict tire degradation cliff-points within a 2-lap margin of error.</li>
       </ul>
      </section>

      <section>
       <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#FF2800] mb-4 tracking-tight">3. System Architecture</h2>
       <p className="text-[#7E8B9B] mb-6 leading-relaxed text-sm sm:text-base">
        A hybrid-cloud approach is utilized to balance the massive data ingestion requirements with cost-effective cold storage and lightning-fast client delivery.
       </p>
       
       <div className="bg-[#060A12]/85 border border-[#18458B]/25 rounded-[2px] p-6 font-mono text-xs sm:text-sm overflow-x-auto shadow-xl">
        <div className="flex flex-col gap-6 min-w-[700px]">
         {/* Data Ingestion */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-[#7E8B9B] font-sans">Data Ingestion</div>
          <div className="text-[#FF2800]">→</div>
          <div className="bg-[#03050A] p-3 rounded-[2px] border border-[#18458B]/25 flex-1 text-[#F4F6F9]">
           <strong>OpenF1 API &amp; Official Timing Feeds</strong> (Polling at 10Hz)
          </div>
         </div>
         {/* Processing Layer */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-[#7E8B9B] font-sans">Processing Layer</div>
          <div className="text-[#FF2800]">→</div>
          <div className="bg-[#03050A] p-3 rounded-[2px] border border-[#18458B]/25 flex-1 text-[#F4F6F9]">
           <strong>AWS Lambda &amp; Python (Pandas/NumPy)</strong> (Cleansing, anomaly detection, predictive inference via Gemini/TensorFlow)
          </div>
         </div>
         {/* Storage Layer */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-[#7E8B9B] font-sans">Storage Layer</div>
          <div className="text-[#FF2800]">→</div>
          <div className="flex gap-4 flex-1">
           <div className="bg-[#03050A] p-3 rounded-[2px] border border-[#18458B]/25 w-1/2 text-[#F4F6F9]">
            <strong>Supabase (PostgreSQL)</strong><br/><span className="text-xs text-[#7E8B9B]">Live State &amp; Realtime Subscriptions</span>
           </div>
           <div className="bg-[#03050A] p-3 rounded-[2px] border border-[#18458B]/25 w-1/2 text-[#F4F6F9]">
            <strong>Amazon S3</strong><br/><span className="text-xs text-[#7E8B9B]">Historical Race Parquet Files</span>
           </div>
          </div>
         </div>
         {/* Client UI */}
         <div className="flex items-center gap-4">
          <div className="w-48 text-right text-[#7E8B9B] font-sans">Client Application</div>
          <div className="text-[#FF2800]">→</div>
          <div className="bg-[#03050A] p-3 rounded-[2px] border border-[#FF2800]/40 text-[#F4F6F9] shadow-2xl flex-1">
           <strong>Next.js + Tailwind + Three.js</strong> (Hosted on Vercel)
          </div>
         </div>
        </div>
       </div>
      </section>

      <section>
       <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#FF2800] mb-4 tracking-tight">4. Core Features &amp; Epics</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#060A12]/85 border border-[#18458B]/25 rounded-[2px] p-6">
         <h3 className="text-base sm:text-lg font-serif font-semibold text-[#F4F6F9] mb-2 tracking-tight">Live Race Command Center</h3>
         <p className="text-[#7E8B9B] text-sm leading-relaxed">A real-time dashboard visualizing driver positions, sector times, and intervals. Includes a dynamic track map powered by GPS telemetry.</p>
        </div>
        <div className="bg-[#060A12]/85 border border-[#18458B]/25 rounded-[2px] p-6">
         <h3 className="text-base sm:text-lg font-serif font-semibold text-[#F4F6F9] mb-2 tracking-tight">AI Strategy Oracle</h3>
         <p className="text-[#7E8B9B] text-sm leading-relaxed">Predicts optimal pit windows and under-cut probabilities by analyzing live tire degradation data against historical track surface models.</p>
        </div>
        <div className="bg-[#060A12]/85 border border-[#18458B]/25 rounded-[2px] p-6">
         <h3 className="text-base sm:text-lg font-serif font-semibold text-[#F4F6F9] mb-2 tracking-tight">Radio Transcription Engine</h3>
         <p className="text-[#7E8B9B] text-sm leading-relaxed">Real-time speech-to-text processing of driver radios to perform sentiment analysis (e.g., detecting driver frustration regarding car balance).</p>
        </div>
        <div className="bg-[#060A12]/85 border border-[#18458B]/25 rounded-[2px] p-6">
         <h3 className="text-base sm:text-lg font-serif font-semibold text-[#F4F6F9] mb-2 tracking-tight">Multi-Discipline Database</h3>
         <p className="text-[#7E8B9B] text-sm leading-relaxed">A unified GraphQL schema allowing engineers to query lap data seamlessly across F1, F2, F3, Formula E, and NASCAR without writing separate API adapters.</p>
        </div>
       </div>
      </section>
     </div>
    </motion.div>
   </main>
   <ContactFooter />
  </div>
 );
}

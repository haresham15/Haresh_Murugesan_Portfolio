export const spotlightProjects = [
  {
    slug: 'healios',
    year: '2026',
    title: 'Healios V2 — Multimodal Post-Op Recovery Platform',
    category: 'AI & Vision',
    highlight: '8.09ms Grad-CAM XAI',
    stack: 'Next.js, TypeScript, Python, FastAPI, TensorFlow',
    description: 'Enterprise-grade clinical recovery monitoring ecosystem integrating Explainable AI (Grad-CAM in 8.09ms), tissue morphology HSV segmentation (2.00ms), edge HTML5 Canvas Laplacian blur gatekeeping (<35ms), and an EHR-integrated clinical recovery agent grounded in ERAS protocols.',
    icons: ['nextjs.svg', 'python.svg', 'fastapi.svg', 'tensorflow.svg', 'typescript.svg'],
    github: 'https://github.com/haresham15/HealiosPostSurgery',
    demo: 'https://healiosaisurgeryassistant.vercel.app/patient/dashboard',
    image: '/healios.png',
    caseStudy: {
      executiveSummary: 'Healios V2 is a full-stack post-surgical recovery intelligence platform combining deep learning, explainable AI, client-side edge computing, and multi-turn clinical decision support. It bridges the trust deficit in healthcare AI by pairing wound risk classifications with real-time gradient saliency maps and color-space tissue morphology analysis.',
      problem: 'Postoperative surgical site infections (SSIs) account for up to 20% of unplanned 30-day hospital readmissions in general and abdominal surgery. Remote monitoring workflows frequently fail because black-box deep learning scores are distrusted by surgeons, blurred patient photographs degrade diagnostic reliability while wasting cloud bandwidth, and generic LLMs hallucinate non-standard advice rather than adhering to validated surgical guidelines (ERAS, CDC SSI surveillance).',
      architecture: 'Engineered as a Next.js 14 and TypeScript frontend coupled with a high-performance Python FastAPI backend and SQLModel EHR persistence layer. Features an Explainable AI (XAI) Grad-CAM engine using a vectorized NumPy piecewise linear Jet colormap (sub-10ms generation without heavy matplotlib dependencies); an HSV color-space tissue segmentation analyzer measuring granulation (proliferative red/pink), slough (fibrinous yellow/tan), and necrosis (avascular eschar); an edge HTML5 Canvas Laplacian blur and luminance quality gatekeeper running in-browser (<35ms) before upload; and a multi-turn clinical recovery agent executing real-time EHR diagnostic tools (tool_get_vitals, tool_get_medications, tool_get_latest_assessment, hybrid_vector_rag_query) with automated surgical escalation triage.',
      tradeoffs: 'Evaluating image focus and exposure on the browser Canvas before transmission eliminated wasted cloud compute on unreadable captures and delivered instant feedback (<35ms) to patients without server round-trips. We also replaced server-side matplotlib rendering with pure NumPy piecewise linear interpolation, cutting memory consumption by 120MB+ and avoiding server GUI thread-locks. For clinical guidance, an embedded in-memory hybrid RAG (BM25 + TF-IDF) achieved 0.14ms lookup speeds with zero cloud database latency.',
      metrics: [
        { label: 'Grad-CAM Saliency', value: '8.09 ms', detail: 'End-to-end generation latency (224x224 input)' },
        { label: 'Tissue Morphology', value: '2.00 ms', detail: 'Vectorized HSV bed segmentation (128x128)' },
        { label: 'Hybrid Protocol RAG', value: '0.14 ms', detail: 'BM25 + TF-IDF query latency' },
        { label: 'Edge Pre-Flight Gate', value: '< 35 ms', detail: 'In-browser Canvas Laplacian blur check' },
        { label: 'Clinical Agent Exec', value: '5.43 ms', detail: 'EHR diagnostic tool execution + ERAS synthesis' },
        { label: 'Test Suite Coverage', value: '100% PASS', detail: '5/5 unit & integration suites, 0 TS errors' }
      ],
      nextSteps: 'Expanding clinical trial validation across diverse postoperative incisions and Fitzpatrick skin phototypes, followed by WebRTC integration for direct clinician-patient video consultations.'
    }
  },
  {
    slug: 'apexis',
    year: '2026',
    title: 'Apexis — Centralized Motorsports Intelligence Platform',
    category: 'Full-Stack Systems',
    highlight: '60fps Race Sim & OCR',
    stack: 'Next.js, React, TypeScript, TensorFlow.js, Tesseract.js',
    description: 'Unified telemetry and predictive strategy platform for motorsport fans (F1, F2, F3, FE, NASCAR, GTWC). Features a multi-threaded 2D live race simulation Web Worker, client-side Tesseract.js OCR broadcast scanning, a TensorFlow.js tire degradation predictor, and a Gemini-powered Race Engineer.',
    icons: ['nextjs.svg', 'react.svg', 'typescript.svg', 'tensorflow.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/AIMotorsportsHub',
    demo: 'https://ai-motorsports-hub.vercel.app/',
    image: '/apexis.png',
    caseStudy: {
      executiveSummary: 'Apexis aggregates multi-series motorsport telemetry into a singular, interactive intelligence hub. By running 2D race simulations and computer vision standings extraction off-main-thread via Web Workers and deploying TensorFlow.js in the browser, it delivers real-time predictive strategy modeling with zero server compute overhead.',
      problem: 'Motorsport enthusiasts following multiple racing series are forced to toggle between fragmented live-timing websites, static PDF classification sheets, and ungrounded social media commentary. There lacked a centralized dashboard combining live spatial telemetry with contextual AI to explain tire cliff points, pit delta windows, and race strategies dynamically.',
      architecture: 'Built on Next.js 14 (App Router), React, TypeScript, and Tailwind CSS with serverless Next.js API routes. Offloads compute-heavy tasks to dedicated browser Web Workers: a custom 2D simulation engine (simulator.worker.ts) renders real-time driver positions using OpenF1 track geometries, while Tesseract.js OCR extracts standings from external TV feeds directly in-browser. An embedded TensorFlow.js neural network projects tire degradation penalties, and an indexed local SQLite database (better-sqlite3) powers sub-15ms historical head-to-head comparisons dating back to 1950.',
      tradeoffs: 'Migrating the physics simulation engine and broadcast OCR entirely to client-side Web Workers eliminated expensive cloud GPU/server infrastructure and network streaming latency. The tradeoff is requiring modern client hardware capable of sustaining 60fps rendering during multi-car endurance sessions.',
      metrics: [
        { label: 'Simulation Frame Rate', value: '60 fps', detail: 'Off-main-thread Web Worker physics pipeline' },
        { label: 'Broadcast OCR Engine', value: '100% Client-Side', detail: 'Tesseract.js worker running zero-cost in browser' },
        { label: 'Historical Query Time', value: '< 12 ms', detail: 'Indexed local SQLite lookups across 1950–present' },
        { label: 'Telemetry API Latency', value: '< 150 ms', detail: 'Serverless OpenF1 telemetry ingestion' }
      ],
      nextSteps: 'Implementing live team-radio audio transcription and predictive machine learning models for safety-car deployment likelihood during incident sectors.'
    }
  },
  {
    slug: 'tempo',
    year: '2026',
    title: 'Tempo — RSD Communication Buffer & Regulation Suite',
    category: 'AI & Vision',
    highlight: '100% Crisis Recall',
    stack: 'Next.js 15, React 19, TypeScript, PostgreSQL (pgvector)',
    description: 'Tactical emotional buffer and executive regulation suite designed for Rejection Sensitive Dysphoria (RSD) and ADHD task freeze. Features PostgreSQL pgvector IVFFlat Cosine RAG, 100% crisis recall deterministic safety, dual-provider failover (DeepSeek V3 / Gemini), and Spatial Task Chunker CV.',
    icons: ['nextjs.svg', 'react.svg', 'typescript.svg', 'sql.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/TempoADHDAssist',
    demo: 'https://github.com/haresham15/TempoADHDAssist',
    image: '/tempo.png',
    caseStudy: {
      executiveSummary: 'Tempo serves as a cognitive circuit breaker for neurodivergent individuals facing rejection sensitivity and task paralysis. It pairs an ephemeral, zero-destination communication buffer with PostgreSQL pgvector semantic emotional memory, deterministic crisis interception, and spatial vision task chunking.',
      problem: 'For individuals with ADHD and RSD, ambiguous messages (a brief email from a manager or flat text from a friend) trigger an immediate, autonomic fight-or-flight alarm. In acute distress, prefrontal executive function shuts down, precipitating impulsive defensive replies, task freeze, and shame spirals. Existing productivity software exacerbates working memory overload.',
      architecture: 'Built on Next.js 15, React 19, TypeScript, and accessible WCAG AAA CSS Modules with Supabase PostgreSQL and Row Level Security. Leverages PostgreSQL pgvector IVFFlat Cosine Similarity (768-dim embeddings) to retrieve historically resolved spirals matching the current trigger. Implements an active-passive LLM failover state machine (DeepSeek V3 primary structured JSON → Google Gemini 3.5 Flash Lite fallback) with 1-turn Zod schema self-correction. Employs Gemini Multimodal Vision for a Spatial Task Chunker that spotlights one item from messy room photos, alongside a Web Audio engine generating Brownian noise, a 65 BPM vagal grounding pulse, and a 432Hz harmonic drone.',
      tradeoffs: 'Omitted all outgoing third-party integrations (Slack, email, SMS) by design. While this requires manual copy-pasting, it creates an absolute zero-destination barrier that guarantees an emotionally volatile draft cannot be accidentally sent. Furthermore, a deterministic regex safety filter intercepts crisis language in 0.2ms before model dispatch, eliminating hallucination risks on life-safety triggers.',
      metrics: [
        { label: 'Crisis Detection Recall', value: '100.0%', detail: '5/5 caught, 0 false negatives on 30-case benchmark' },
        { label: 'Colloquial False-Alarm', value: '0.0%', detail: '0/5 false positives on colloquial distress idioms' },
        { label: 'Zod Schema Parse Rate', value: '100.0%', detail: '0 syntax crashes via 1-turn prompt self-correction' },
        { label: 'Primary LLM Latency', value: 'p50: 644 ms', detail: 'DeepSeek V3 structured JSON response time' },
        { label: 'Fallback LLM Latency', value: 'p50: 828 ms', detail: 'Gemini 3.5 Flash Lite failover response time' },
        { label: 'Semantic RAG Accuracy', value: '100.0%', detail: 'pgvector Cosine Sim 0.824 surfacing past spirals' },
        { label: 'Inference Cost / Turn', value: '$0.00007', detail: 'Low-cost token reasoning optimization' }
      ],
      nextSteps: 'Developing an on-device quantized small language model (Gemma 2 2B via WebGPU / ONNX) to enable 100% offline, air-gapped emotional reframing on mobile browsers.'
    }
  },
  {
    slug: 'careline',
    year: '2026',
    title: 'Careline — Bi-Directional Transit Hub',
    category: 'Research & Data',
    highlight: '1st Place DataFest 2026',
    stack: 'React, Python, OSRM, DBSCAN, Pandas',
    description: 'Predictive logistics engine solving healthcare transit barriers through bi-directional shuttle optimization for Stormont Vail Health. 1st Place Winner at DataFest 2026 (Best Use of External Data).',
    icons: ['react.svg', 'python.svg', 'javascript.svg', 'pandas.svg'],
    github: 'https://github.com/haresham15/Careline',
    demo: 'https://data-fest2026.vercel.app/',
    image: '/careline.png',
    caseStudy: {
      executiveSummary: 'Patients from transit-poor neighborhoods miss preventative care and escalate to the ER. Discharged patients are trapped in beds because public transit cannot get them home. One bi-directional shuttle fleet solves both problems on a single unified budget.',
      problem: 'Stormont Vail Health faced a regional healthcare crisis: patients from transit-vulnerable areas escalated to emergency rooms for preventable conditions, while medically cleared patients occupied acute-care hospital beds due to lack of transit. 43 of 141 Census Blocks had zero bus stops within 800m.',
      architecture: 'Engineered a spatial data analytics platform combining a custom Transit Vulnerability Index and DBSCAN clustering to group high-vulnerability blocks into shuttle zones. Utilized Open Source Routing Machine (OSRM) for turn-by-turn routing and an interactive React dashboard for discharge manifests.',
      tradeoffs: 'Processed millions of geospatial data points but faced performance bottlenecks during DataFest 2026. We mitigated this by aggregating data into regional bounding boxes and shuttle zone clusters, sacrificing micro-level coordinate detail for macro-level routing efficiency.',
      metrics: [
        { label: 'Award', value: '1st Place', detail: 'Best Use of External Data (American Statistical Association)' },
        { label: 'Transit Gap Identified', value: '43 Blocks', detail: 'Found 43 of 141 census blocks with zero 800m bus access' },
        { label: 'Routing Engine', value: 'OSRM Turn-by-Turn', detail: 'Bi-directional patient pickup & discharge routing' }
      ],
      nextSteps: 'Further optimize the shuttle routing by integrating real-time traffic data and expanding the Transit Vulnerability Map to cover additional regional healthcare facilities.'
    }
  }
];

export const archiveProjects = [
  {
    slug: 'nyc-housing-market-ai',
    year: '2026',
    title: 'NYC Housing Market AI/ML Analysis',
    category: 'Research & Data',
    highlight: 'Hackathon Award Winner',
    stack: 'React, Python, Scikit-Learn, K-Means',
    description: 'Interactive spatial physics and ML visualization engine analyzing housing value concentration, wealth gravity, and gentrification vectors across NYC. Awarded at Hack To The Future.',
    icons: ['react.svg', 'python.svg', 'scitkitlearn.svg', 'javascript.svg'],
    github: 'https://github.com/haresham15/DataIO',
    link: 'https://github.com/haresham15/DataIO',
    image: '/nyc-map-magnet.png',
    caseStudy: {
      executiveSummary: 'Award-winning project from the Hack To The Future hackathon. An interactive spatial data visualization engine that leverages machine learning and spatial physics to analyze housing value concentration, wealth gravity, and gentrification vectors across NYC.',
      problem: 'Traditional real estate models view housing prices as a static map of costs. There was a need to dynamically visualize how high-density wealth zones pull market value inward and accelerate gentrification across the five boroughs.',
      architecture: 'Built a high-performance React frontend that consumes parsed NYC spatial datasets. Utilizes K-Means Clustering to detect hidden similarities between properties based on age, location, and price.',
      tradeoffs: 'Optimized for front-end rendering speed and immersive 3D aesthetics for the hackathon, meaning the tool currently relies on pre-processed machine learning outputs rather than real-time model inference.',
      nextSteps: 'Integrate real-time real estate API feeds to keep the AI model updated with current market fluctuations and adapt to ongoing migration patterns.'
    }
  },
  {
    slug: 'cv-allergy-wheal',
    year: '2026',
    title: 'Digital Pathology & Allergy Wheal CV Research',
    category: 'AI & Vision',
    highlight: 'Ohio State Research',
    stack: 'Python, OpenCV, TensorFlow, Scikit-Image',
    description: 'Automated computer vision image-processing pipeline quantifying allergy skin prick test (SPT) wheal and flare areas, replacing subjective millimeter calipers with standardized clinical metrics.',
    icons: ['python.svg', 'tensorflow.svg', 'scitkitlearn.svg'],
    github: 'https://github.com/haresham15/cv_allergy_wheal',
    link: 'https://github.com/haresham15/cv_allergy_wheal',
    image: '/cv-allergy-wheal.png',
    caseStudy: {
      executiveSummary: 'Computer vision research developed at The Ohio State University to automate allergy skin prick test (SPT) wheal and flare quantification, replacing subjective millimeter calipers with standardized clinical imaging metrics.',
      problem: 'Manual millimeter ruler measurements of skin prick test wheals suffer from high inter-observer variability and measurement error in allergy clinics, leading to inconsistent diagnostic grading for environmental and food allergens.',
      architecture: 'Engineered an image processing pipeline combining spatial color thresholding, convex hull edge contouring, and elliptical fitting to calculate major/minor axis lengths and total wheal surface area in square millimeters against calibration markers.',
      tradeoffs: 'Prioritized deterministic geometric contouring over deep convolutional segmentation networks to ensure transparent, reproducible measurements that clinical researchers could audit directly without black-box opacity.',
      nextSteps: 'Validate the automated contouring algorithm across a multi-center dataset of varying patient skin tones and erythema intensities.'
    }
  },
  {
    slug: 'syntinuum-podcast-website',
    year: '2026',
    title: 'Syntinuum Podcast Website',
    category: 'Full-Stack Systems',
    highlight: '100K+ Impressions',
    stack: 'JavaScript, React, Tailwind CSS',
    description: 'Global audio streaming web application for the Syntinuum podcast, delivering persistent audio playback, episode catalogs, and responsive listening interfaces across devices.',
    icons: ['javascript.svg', 'react.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/Syntinuum_podcast_website',
    demo: 'https://www.syntinuumpodcast.com/',
    link: 'https://github.com/haresham15/Syntinuum_podcast_website',
    caseStudy: {
      executiveSummary: 'A fast, accessible web application built to host, stream, and catalog podcast episodes for the Syntinuum network (100K+ combined cross-platform impressions).',
      problem: 'Off-the-shelf podcast landing pages lacked the custom aesthetic and audio control required for an engaging listener experience.',
      architecture: 'Built a bespoke frontend using React and Tailwind CSS, utilizing HTML5 audio APIs and React Context for persistent, uninterrupted global audio playback across page navigations.',
      tradeoffs: 'Eschewed a heavy CMS in favor of a static JSON-driven architecture to maximize page load speeds and SEO performance.',
      nextSteps: 'Implement a lightweight headless CMS to allow guest information and transcripts to be updated dynamically.'
    }
  },
  {
    slug: 'philocracy',
    year: '2025',
    title: 'Philocracy Platform',
    category: 'Full-Stack Systems',
    highlight: 'Structured Debate Trees',
    stack: 'Next.js, Tailwind CSS, React',
    description: 'Structured philosophical debate platform enforcing logical argumentation schemas, claim citations, and nested premise trees to combat online discourse polarization.',
    icons: ['nextjs.svg', 'tailwind.svg', 'react.svg'],
    github: 'https://github.com/haresham15/Philocracy',
    link: 'https://github.com/haresham15/Philocracy',
    caseStudy: {
      executiveSummary: 'A platform aiming to structure debate and philosophical discourse, providing tools for structured argumentation and claims validation.',
      problem: 'Online discussion forums reward outrage over nuanced discussion. Philocracy was designed to structurally enforce logical progression and evidence-based claims in debates.',
      architecture: 'Developed utilizing the Next.js App Router for server-side rendering, styled with Tailwind for a clean, distraction-free reading experience with nested argument tree state management.',
      tradeoffs: 'Focused on argument hierarchy modeling and clean typography for the MVP, using structured JSON schemas before connecting a live relational database backend.',
      nextSteps: 'Integrate Supabase to enable multi-user argument branching, claim citation verification, and real-time voting.'
    }
  },
  {
    slug: 'cs50-ai-projects',
    year: '2025',
    title: 'CS50 Intro to AI with Python',
    category: 'AI & Vision',
    highlight: 'Harvard CS50 AI',
    stack: 'Python, TensorFlow, NumPy',
    description: 'Hands-on implementations of classical AI and probabilistic reasoning algorithms: Minimax with Alpha-Beta pruning, HMMs, k-NN, and feed-forward neural networks from mathematical first principles.',
    icons: ['python.svg', 'tensorflow.svg', 'numpy.svg'],
    github: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
    link: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
    caseStudy: {
      executiveSummary: 'A collection of artificial intelligence implementations covering classical search algorithms, probabilistic inference, and neural networks completed for Harvard’s CS50 AI course.',
      problem: 'Mastering foundational AI algorithms requires hands-on implementation from mathematical first principles rather than relying solely on high-level wrappers.',
      architecture: 'Implemented core algorithms including Minimax with Alpha-Beta Pruning, Hidden Markov Models, k-Nearest Neighbors, and feed-forward neural networks using Python and NumPy.',
      tradeoffs: 'Prioritized mathematical clarity and algorithmic correctness over low-level C++ speed optimizations.',
      nextSteps: 'Package reusable components into an educational CLI suite for students exploring search algorithms.'
    }
  },
  {
    slug: 'tutormatch',
    year: '2025',
    title: 'TutorMatch: AI-Powered Tutoring Platform',
    category: 'AI & Vision',
    highlight: 'Zero-Shot NLP Matching',
    stack: 'Python, Streamlit, Hugging Face',
    description: 'Algorithmic matching portal pairing students with verified tutors based on course requirements, Haversine geospatial proximity, and Hugging Face zero-shot resume validation.',
    icons: ['python.svg', 'streamlit.svg', 'huggingface.svg'],
    github: 'https://github.com/haresham15/TutorMatch_WebApp',
    link: 'https://github.com/haresham15/TutorMatch_WebApp',
    caseStudy: {
      executiveSummary: 'A web application that matches students with optimal tutors based on course requirements, geographic proximity via Haversine distance, and NLP-validated resume credentials.',
      problem: 'Students struggle to find tutors with verified subject-matter expertise within their local geographic area, while manual resume vetting is slow and inconsistent.',
      architecture: 'Built on a Streamlit frontend with a custom matching algorithm. Leveraged Hugging Face zero-shot classification pipelines and PyPDF2 to parse uploaded tutor resumes, validating stated credentials before calculating proximity matches.',
      tradeoffs: 'Used Streamlit for rapid prototyping of the AI classification pipeline, prioritizing algorithm iteration speed over custom component styling.',
      nextSteps: 'Migrate the interface to Next.js and deploy the classification model as a dedicated microservice.'
    }
  },
  {
    slug: 'carstomer',
    year: '2025',
    title: 'CarStomer: Car Value Analysis',
    category: 'Research & Data',
    highlight: 'Random Forest Valuation',
    stack: 'Python, Streamlit, Scikit-Learn',
    description: 'Predictive automotive valuation engine using Random Forest regression over historical sales data to forecast used car fair-market value based on mileage, trim, and market trends.',
    icons: ['python.svg', 'streamlit.svg', 'scitkitlearn.svg'],
    github: 'https://github.com/haresham15/CarStomerCarAnalysis',
    link: 'https://github.com/haresham15/CarStomerCarAnalysis',
    caseStudy: {
      executiveSummary: 'A data-driven application predicting used vehicle valuations based on historical market trends, mileage degradation, and trim features.',
      problem: 'Used car pricing can be opaque, making it difficult for buyers to determine fair market value without manual research across disparate listings.',
      architecture: 'Trained a Random Forest regressor on historical automotive sales data, exposing an interactive parameter tuning dashboard via Streamlit.',
      tradeoffs: 'Constrained feature space to high-volume commuter models to ensure robust model confidence intervals rather than over-fitting to rare luxury trims.',
      nextSteps: 'Incorporate real-time localized dealership price scraping to track regional supply and demand shifts.'
    }
  },
  {
    slug: 'momwebsite',
    year: '2025',
    title: 'Professional Services Client Portal',
    category: 'Full-Stack Systems',
    highlight: 'TypeScript & SEO Portal',
    stack: 'Next.js, TypeScript, React',
    description: 'High-conversion business portal and booking interface built with strict TypeScript types, server-side rendering, and responsive mobile architecture deployed on Vercel.',
    icons: ['nextjs.svg', 'typescript.svg', 'react.svg'],
    github: 'https://github.com/haresham15/MomWebsite',
    link: 'https://github.com/haresham15/MomWebsite',
    caseStudy: {
      executiveSummary: 'A fast, responsive business website and client portal built with Next.js and TypeScript, optimized for high Core Web Vitals and search visibility.',
      problem: 'The previous web presence was unoptimized and lacked mobile responsiveness, hindering organic client inquiry conversion.',
      architecture: 'Engineered a modern Next.js application with strict TypeScript types, server-side rendering, and automated contact validation deployed on Vercel.',
      tradeoffs: 'Built a custom React codebase instead of a no-code website builder to maintain complete control over DOM tree size, asset loading, and Lighthouse performance.',
      nextSteps: 'Integrate automated appointment scheduling with calendar synchronization.'
    }
  },
  {
    slug: 'murugesan-rajaram-lab',
    year: '2025',
    title: 'Murugesan Rajaram Lab Website',
    category: 'Full-Stack Systems',
    highlight: 'Academic Research Portal',
    stack: 'Next.js, TypeScript, React',
    description: 'Academic research lab portal cataloging peer-reviewed biomedical publications, grant awards, and researcher profiles, engineered with schema-driven React components.',
    icons: ['nextjs.svg', 'typescript.svg', 'react.svg'],
    github: 'https://github.com/haresham15/murugesan_rajaram_lab_website',
    link: 'https://github.com/haresham15/murugesan_rajaram_lab_website',
    caseStudy: {
      executiveSummary: 'An academic research lab portal built on Next.js to catalog peer-reviewed publications, grant milestones, and research team profiles.',
      problem: 'Academic websites often suffer from unmaintained layouts that fail to clearly communicate research outputs to funding bodies and prospective graduate researchers.',
      architecture: 'Structured modular React components driven by validated JSON schemas, allowing frictionless publication and personnel updates with static site generation.',
      tradeoffs: 'Selected static JSON schemas to ensure zero maintenance and zero hosting overhead while keeping page transitions instantaneous.',
      nextSteps: 'Connect directly to the PubMed API to automatically pull and index new lab publications upon acceptance.'
    }
  },
  {
    slug: 'software-2-projects',
    year: '2024',
    title: 'Software 2 Engineering Projects',
    category: 'Systems & Core',
    highlight: 'Data Structures & Invariants',
    stack: 'Java, JUnit',
    description: 'Advanced software engineering implementations covering fundamental data structures, memory management, pointer manipulation, and recursive tree invariants in Java with JUnit.',
    icons: ['java.svg'],
    github: 'https://github.com/haresham15/Haresh-s-Software-2-Projects',
    link: 'https://github.com/haresham15/Haresh-s-Software-2-Projects',
    caseStudy: {
      executiveSummary: 'A collection of advanced software engineering implementations focusing on fundamental data structures, memory management, and algorithmic complexity in Java.',
      problem: 'Writing production-grade systems requires an uncompromising foundation in pointer manipulation, recursion, trees, and Big-O efficiency.',
      architecture: 'Implemented custom collections, binary search trees, sorting routines, and graph traversal algorithms adhering strictly to unit-tested invariants (JUnit).',
      tradeoffs: 'Focused on algorithmic correctness, strict unit testing, and Big-O performance rather than UI layers.',
      nextSteps: 'Expose core data structures via REST microservices to benchmark concurrency under high thread contention.'
    }
  },
  {
    slug: 'software-1-projects',
    year: '2024',
    title: 'Software 1 Engineering Projects',
    category: 'Systems & Core',
    highlight: 'Java OOP & Contracts',
    stack: 'Java',
    description: 'Foundational object-oriented design implementations emphasizing encapsulation, clean class contracts, defensive programming, and modular design patterns in Java.',
    icons: ['java.svg'],
    github: 'https://github.com/haresham15/Software-Project-Java-Collection-',
    link: 'https://github.com/haresham15/Software-Project-Java-Collection-',
    caseStudy: {
      executiveSummary: 'Foundational Java software projects covering object-oriented design patterns, encapsulation, and unit testing.',
      problem: 'Mastering software engineering requires hands-on mastery of language typing, control flow, and modular class decomposition.',
      architecture: 'Constructed standalone modular Java applications emphasizing DRY principles, defensive programming, and readable documentation.',
      tradeoffs: 'Maintained strict single-responsibility scope across all modules to emphasize clean class contracts.',
      nextSteps: 'Refactor older imperative loops into functional Java Stream pipelines.'
    }
  },
  {
    slug: 'portfolio-website',
    year: '2024',
    title: 'Personal Portfolio & Design System',
    category: 'Full-Stack Systems',
    highlight: 'Three.js & Particle Engine',
    stack: 'React, Next.js, Tailwind CSS, Three.js',
    description: 'Interactive personal portfolio and cinematic design system featuring 3D Three.js neural networks, Google Antigravity-inspired interactive particles, and SSG static export.',
    icons: ['nextjs.svg', 'react.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/Haresh_Murugesan_Portfolio',
    demo: 'https://hareshmurugesan.com',
    link: 'https://github.com/haresham15/Haresh_Murugesan_Portfolio',
    caseStudy: {
      executiveSummary: 'The interactive personal portfolio and design system you are currently viewing, featuring 3D Three.js neural visualizations, dynamic Framer Motion animations, and SSG static export.',
      problem: 'Standard static resumes and generic templates fail to communicate an engineer’s full-stack craftsmanship, design intuition, and technical storytelling.',
      architecture: 'Crafted with Next.js, Tailwind CSS, Framer Motion, and React Three Fiber. Configured for static export with optimized asset bundling and responsive glassmorphism.',
      tradeoffs: 'Balanced rich 3D Canvas visual effects with performance by dynamically loading heavy components and running WebGL background renders without CPU bottlenecks.',
      nextSteps: 'Add interactive terminal playground allowing recruiters to test API endpoints directly in-browser.'
    }
  },
  {
    slug: 'anna-birthday',
    year: '2024',
    title: 'A Birthday Website for my Brother!',
    category: 'Full-Stack Systems',
    highlight: 'Interactive Timeline',
    stack: 'React, Tailwind CSS, JavaScript',
    description: 'Personalized single-page web experience showcasing custom CSS keyframe animations, interactive memory timeline states, and responsive component design.',
    icons: ['react.svg', 'tailwind.svg', 'javascript.svg'],
    github: 'https://github.com/haresham15/AnnaBirthdayWebsite',
    link: 'https://github.com/haresham15/AnnaBirthdayWebsite',
    caseStudy: {
      executiveSummary: 'A personalized interactive single-page web experience built as a digital gift, showcasing custom CSS animations and responsive component design.',
      problem: 'Creating a memorable digital experience requires thoughtful interaction design and polished responsive styling.',
      architecture: 'Constructed with React and Tailwind CSS, featuring custom timeline animation states and micro-interactions.',
      tradeoffs: 'Optimized purely for emotional delight and visual impact for a single user rather than generalized configurability.',
      nextSteps: 'Extract interactive memory timeline into an open-source template component.'
    }
  }
];

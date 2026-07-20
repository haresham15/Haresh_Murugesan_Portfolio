export const spotlightProjects = [
 {
  slug: 'healios',
  title: 'Healios - AI Post-Surgical Recovery Assistant',
  description: 'Engineered a full-stack computer vision application utilizing a fine-tuned TensorFlow model to classify surgical wounds and allergy test wheals across 10 distinct classes. Achieved highly accurate multi-class predictions, outperforming standard edge-detection algorithms. The application is now fully deployed and accessible to patients.',
  icons: ['react.svg', 'python.svg', 'tensorflow.svg', 'tailwind.svg', 'fastapi.svg'],
  github: 'https://github.com/haresham15/healios',
  demo: 'https://healiosaisurgeryassistant.vercel.app/patient/dashboard',
  image: '/healios.png',
  caseStudy: {
   executiveSummary: 'Healios is a comprehensive AI-driven tool designed to assist patients in monitoring post-surgical wound recovery. By leveraging a fine-tuned TensorFlow multi-class classifier and a React frontend, it accurately categorizes wounds into 10 classifications and maps them to actionable risk levels.',
   problem: 'Standard post-surgical recovery relies heavily on infrequent in-person visits. Patients often misidentify early signs of infection, leading to readmissions. Existing computer vision solutions used rudimentary edge detection, which failed on varied skin tones and complex wound topologies.',
   architecture: 'The platform uses a FastAPI backend with Pydantic validation to serve a custom TensorFlow model (.h5). Images are automatically resized (224x224), converted to RGB, and normalized before inference. The Vite/React frontend processes the 10-class output (e.g., Abrasions, Diabetic Wounds, Venous Wounds) to generate "Healthy", "At-Risk", or "Critical" recommendations. The frontend is seamlessly deployed and hosted on Vercel.',
   tradeoffs: 'Hosting a full TensorFlow model within a standard FastAPI instance introduces higher memory consumption and inference latency compared to simple OpenCV scripts. I mitigated this by optimizing the image preprocessing pipeline, trading a negligible 1% accuracy drop for a significant speedup in client response times.',
   nextSteps: 'The model currently struggles with severe lighting variations and extreme shadows. Next iteration involves data augmentation with simulated lighting conditions and migrating the model to TensorFlow Lite for on-device inference to reduce server costs.'
  }
 },
 {
  slug: 'ai-motorsports-hub',
  title: 'AIMotorsportsHub',
  description: 'Developed a real-time telemetry aggregation platform processing live race data from 20+ F1 sessions via the OpenF1 API. Architected a scalable hybrid-cloud solution utilizing AWS Lambda, Supabase, and Vercel, integrating the Gemini API for real-time predictive insights.',
  icons: ['react.svg', 'python.svg', 'javascript.svg', 'nextjs.svg', 'aws.svg'],
  github: 'https://github.com/haresham15/AIMotorsportsHub',
  demo: '',
  image: '',
  caseStudy: {
   executiveSummary: 'AIMotorsportsHub is a comprehensive, real-time telemetry dashboard for F1 enthusiasts. It aggregates live data from over 20 F1 sessions using a hybrid-cloud architecture and provides AI-driven strategic insights via the Gemini API.',
   problem: 'Motorsports teams and enthusiasts lack accessible, unified dashboards for real-time telemetry. Aggregating 20+ F1 session data streams usually requires expensive enterprise software, and rendering this data on the web often results in severe latency issues and browser crashes.',
   architecture: 'I adopted a hybrid-cloud microservices architecture to balance cost, speed, and complexity. The OpenF1 API feeds into AWS Lambda for initial processing and normalization. Historical aggregates are stored in S3, while live state is pushed to Supabase, finally served to a Next.js frontend hosted on Vercel.',
   tradeoffs: 'Using a hybrid cloud (AWS + Supabase + Vercel) increased operational complexity and deployment friction. While a monolith on a single VPS would have been simpler to orchestrate, the hybrid approach allowed me to leverage generous free tiers and scale specific microservices independently during race weekends.',
   nextSteps: 'Websocket connection drops during high-volume telemetry spikes are currently causing UI stuttering. I am actively researching Redis pub/sub implementations to buffer the event stream and smooth out the delivery to the client.'
  }
 },
 {
  slug: 'nyc-housing-market-ai',
  title: 'NYC Housing Market AI/ML Analysis',
  description: 'Award-winning project from the Hack To The Future hackathon. Engineered a cyberpunk-themed, interactive visualization engine that leverages machine learning and spatial data analytics to analyze housing value concentration, wealth gravity, and gentrification vectors across New York City.',
  icons: ['javascript.svg', 'css.svg', 'react.svg', 'python.svg', 'scitkitlearn.svg'],
  github: 'https://github.com/haresham15/DataIO',
  demo: 'https://data-io-gamma.vercel.app/',
  image: '/nyc-map-magnet.png',
  caseStudy: {
   executiveSummary: 'Developed during the Hack To The Future hackathon, this project is a dynamic market physics engine designed to visualize the NYC housing crisis. By treating the real estate market as a physical system, it uses AI/ML to map wealth gravity wells and economic zones.',
   problem: 'Traditional real estate models view housing prices as a static map of costs. There was a need to dynamically visualize how high-density wealth zones pull market value inward and accelerate gentrification across the five boroughs.',
   architecture: 'Built a high-performance React frontend that consumes parsed NYC spatial datasets. It features dynamic rendering wrappers and utilizes K-Means Clustering to detect hidden similarities between properties based on age, location, and price.',
   tradeoffs: 'Optimized for front-end rendering speed and immersive 3D/cyberpunk aesthetics for the hackathon, meaning the tool currently relies on pre-processed machine learning outputs rather than real-time model inference.',
   nextSteps: 'Integrate real-time real estate API feeds to keep the AI model updated with current market fluctuations and adapt to ongoing migration patterns.'
  }
 },
 {
  slug: 'careline',
  title: 'Bi-Directional Transit Hub (Careline)',
  description: 'Predictive logistics engine solving healthcare transit barriers through bi-directional shuttle optimization for Stormont Vail Health. Built for DataFest 2026.',
  icons: ['react.svg', 'python.svg', 'javascript.svg', 'pandas.svg'],
  github: 'https://github.com/haresham15/Careline',
  demo: 'https://data-fest2026.vercel.app/',
  image: '/careline.png',
  caseStudy: {
   executiveSummary: 'Patients from transit-poor neighborhoods miss preventative care and escalate to the ER. Discharged patients are trapped in beds because public transit can\'t get them home. One bi-directional shuttle fleet solves both problems on a single budget.',
   problem: 'Stormont Vail Health faced a crisis: patients from transit-vulnerable areas escalated to the ER, while medically cleared patients were stuck in beds due to lack of transit. 43 of 141 Census Blocks had zero bus stops within 800m.',
   architecture: 'Engineered a spatial data analytics platform combining a Transit Vulnerability Index and DBSCAN clustering to group high-vulnerability blocks into shuttle zones. Utilized Open Source Routing Machine (OSRM) for turn-by-turn routing and an interactive dashboard for discharge manifests.',
   tradeoffs: 'Processed millions of geospatial data points but faced performance bottlenecks during DataFest 2026. We mitigated this by aggregating data into regional bounding boxes and shuttle zone clusters, sacrificing micro-level detail for macro-level routing efficiency.',
   nextSteps: 'Further optimize the shuttle routing by integrating real-time traffic data and expanding the Transit Vulnerability Map to cover additional regional healthcare facilities.'
  }
 }
];

export const archiveProjects = [

 {
  slug: 'syntinuum-podcast-website',
  year: '2026',
  title: 'Syntinuum Podcast Website',
  stack: 'JavaScript, React, Tailwind CSS',
  icons: ['javascript.svg', 'react.svg', 'tailwind.svg'],
  link: 'https://github.com/haresham15/Syntinuum_podcast_website',
  caseStudy: {
   executiveSummary: 'A dynamic, accessible, and highly performant web application built to host, stream, and catalog podcast episodes for the Syntinuum network.',
   problem: 'Off-the-shelf podcast hosts lacked the custom branding and interactive transcript features required for a highly engaging listener experience, resulting in a disjointed user journey.',
   architecture: 'Built a bespoke frontend using React and Tailwind CSS, utilizing HTML5 audio APIs and React Context for seamless, uninterrupted global audio playback across page navigations.',
   tradeoffs: 'Eschewed a heavy CMS in favor of a static JSON-driven architecture to maximize page load speeds and SEO performance, which requires manual code updates when new episodes launch.',
   nextSteps: 'Implement a headless CMS like Sanity to allow non-technical hosts to easily upload and manage new episodes without requiring developer intervention.'
  }
 },
 {
  slug: 'philocracy',
  year: '2025',
  title: 'Philocracy Platform',
  stack: 'Next.js, Tailwind CSS, React',
  icons: ['nextjs.svg', 'tailwind.svg', 'react.svg'],
  link: 'https://github.com/haresham15/Philocracy',
  caseStudy: {
   executiveSummary: 'A platform aiming to democratize debate and philosophical discourse, providing tools for structured argumentation and community voting, built entirely on Next.js.',
   problem: 'Social media platforms reward outrage over nuanced discussion. There was a desperate need for a platform that structurally enforces logical progression and evidence-based claims in debates.',
   architecture: 'Developed utilizing the Next.js App Router for optimal SEO and server-side rendering, styled with Tailwind for a clean, distraction-free reading experience. Complex state management handles nested argument trees.',
   tradeoffs: 'Focused entirely on the frontend logic and structural flow for the MVP, relying on mock data rather than building out a complex real-time database backend.',
   nextSteps: 'Integrate Firebase or Supabase to enable real-time multiplayer debate mechanics, user authentication, and persistent argument branching.'
  }
 },
 {
  slug: 'cs50-ai-projects',
  year: '2025',
  title: 'CS50 Intro to AI with Python',
  stack: 'Python, TensorFlow, NumPy',
  icons: ['python.svg', 'tensorflow.svg', 'numpy.svg'],
  link: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
  caseStudy: {
   executiveSummary: 'A collection of artificial intelligence projects implementing graph search algorithms, reinforcement learning, and neural networks as part of Harvard\'s CS50 AI course.',
   problem: 'Gaining a foundational, from-scratch understanding of classical and modern AI algorithms requires hands-on implementation without relying entirely on high-level abstraction libraries.',
   architecture: 'Implemented foundational algorithms including Minimax for game playing, Hidden Markov Models for probability tracking, and custom feed-forward neural networks using raw Python and NumPy arrays.',
   tradeoffs: 'Algorithms were optimized for educational clarity and correctness rather than production-grade execution speed, meaning some search spaces take longer to traverse than highly-optimized C++ variants.',
   nextSteps: 'Refactor select algorithms into a unified Python package to serve as an educational library for other students interested in AI foundations.'
  }
 },
 {
  slug: 'tutormatch',
  year: '2025',
  title: 'TutorMatch: AI-Powered Tutoring Platform',
  stack: 'Python, Streamlit, HuggingFace',
  icons: ['python.svg', 'streamlit.svg', 'huggingface.svg'],
  link: 'https://github.com/haresham15/TutorMatch_WebApp',
  caseStudy: {
   executiveSummary: 'An AI-powered web application that intelligently matches students with optimal tutors based on course performance, geographic proximity via Haversine distance, and AI-validated credentials.',
   problem: 'Students often struggle to find tutors that align with their specific learning pedagogies and locations, while untrustworthy tutor credentials lead to ineffective tutoring sessions.',
   architecture: 'Built on a Streamlit frontend with a custom matching algorithm. It leverages HuggingFace\'s zero-shot classification pipeline and PyPDF2 to parse uploaded tutor resumes, validating their stated credentials before matching them with students based on geographic distance.',
   tradeoffs: 'Relied heavily on Streamlit for the UI which limited front-end customizability, but it enabled incredibly fast iteration on the underlying AI classification and geographic matching logic.',
   nextSteps: 'Migrate the frontend to Next.js for a more polished user experience and deploy the HuggingFace zero-shot classifier as an independent microservice to improve load times.'
  }
 },
 {
  slug: 'carstomer',
  year: '2025',
  title: 'CarStomer: Car Value Analysis',
  stack: 'Python, Streamlit, Scikit-Learn',
  icons: ['python.svg', 'streamlit.svg', 'scitkitlearn.svg'],
  link: 'https://github.com/haresham15/CarStomerCarAnalysis',
  caseStudy: {
   executiveSummary: 'A data-driven application that assists consumers in analyzing vehicle specializations and predicts used car values based on historical market data, mileage, and condition metrics.',
   problem: 'The used car market is highly volatile and opaque, making it exceedingly difficult for average consumers to determine if they are receiving a fair price without exhaustive manual research.',
   architecture: 'Trained a Random Forest regressor using Scikit-Learn on a substantial dataset of historical vehicle sales, deploying the interactive model via a Streamlit web interface for consumer access.',
   tradeoffs: 'Sacrificed some model precision on rare luxury vehicles due to lack of diverse training data, actively choosing to focus instead on high accuracy for standard commuter vehicles which form the majority of queries.',
   nextSteps: 'Incorporate real-time web scraping of local dealership inventories to provide localized, up-to-the-minute price evaluations and trend forecasting.'
  }
 },
 {
  slug: 'momwebsite',
  year: '2025',
  title: 'MomWebsite',
  stack: 'Next.js, TypeScript, React',
  icons: ['nextjs.svg', 'typescript.svg', 'react.svg'],
  link: 'https://github.com/haresham15/MomWebsite',
  caseStudy: {
   executiveSummary: 'A fast, responsive, and SEO-optimized business website built with Next.js to showcase professional services and capture potential client leads.',
   problem: 'The previous web presence was outdated, slow to load, and suffered from poor search engine visibility, resulting in a demonstrable loss of business opportunities.',
   architecture: 'Engineered a modern Next.js web application utilizing TypeScript for strict type safety and component reliability. Deployed on Vercel to leverage global edge caching and lightning-fast Server-Side Rendering (SSR).',
   tradeoffs: 'Opted for a bespoke React/Next.js build rather than a simple template builder like Wix to maintain total control over Core Web Vitals and SEO metadata, trading a longer initial development cycle for long-term performance.',
   nextSteps: 'Integrate an automated email marketing pipeline to nurture the leads captured through the new contact forms seamlessly.'
  }
 },
 {
  slug: 'murugesan-rajaram-lab',
  year: '2025',
  title: 'Murugesan Rajaram Lab Website',
  stack: 'Next.js, TypeScript, React',
  icons: ['nextjs.svg', 'typescript.svg', 'react.svg'],
  link: 'https://github.com/haresham15/murugesan_rajaram_lab_website',
  caseStudy: {
   executiveSummary: 'An academic lab website built on Next.js designed to elegantly display research publications, team members, and ongoing scientific projects.',
   problem: 'Academic websites traditionally suffer from dense, unreadable layouts. The lab required a clean, modern interface to attract prospective graduate students and clearly communicate findings to grant funding bodies.',
   architecture: 'Built with the Next.js framework and TypeScript, featuring a highly modular component system that allows for the easy addition of new publications and team members via structured JSON data files.',
   tradeoffs: 'Used static JSON files for data storage to keep hosting costs at absolute zero, which intentionally trades convenience (requiring a developer to push updates) for extreme reliability and speed.',
   nextSteps: 'Connect the publications page directly to the PubMed API to automatically fetch and display new papers as they are published, eliminating manual data entry.'
  }
 },
 {
  slug: 'software-2-projects',
  year: '2024',
  title: 'Software 2 Engineering Projects',
  stack: 'Java, JUnit',
  icons: ['java.svg'],
  link: 'https://github.com/haresham15/Haresh-s-Software-2-Projects',
  caseStudy: {
   executiveSummary: 'A collection of advanced software engineering projects focusing on complex data structures, algorithmic efficiency, and object-oriented design patterns.',
   problem: 'Scaling applications effectively requires a deep, fundamental understanding of memory management, efficient data retrieval mechanisms, and robust system architecture.',
   architecture: 'Implemented custom Collections, self-balancing trees, and complex graph algorithms in Java, strictly adhering to MVC architecture paradigms and comprehensive unit testing frameworks (JUnit).',
   tradeoffs: 'Focused purely on complex backend logic and console interfaces rather than building graphical user interfaces (GUIs), maximizing the time spent on algorithmic optimization and Big-O analysis.',
   nextSteps: 'Wrap the core algorithmic logic of these projects in a Spring Boot REST API to expose them as consumable web services.'
  }
 },
 {
  slug: 'software-1-projects',
  year: '2024',
  title: 'Software 1 Engineering Projects',
  stack: 'Java',
  icons: ['java.svg'],
  link: 'https://github.com/haresham15/Software-Project-Java-Collection-',
  caseStudy: {
   executiveSummary: 'Foundational Java programming projects demonstrating core computer science concepts, object-oriented programming, and basic application development.',
   problem: 'Building robust enterprise software requires a strong, uncompromising grasp of syntax, control flow, error handling, and basic class hierarchies.',
   architecture: 'Developed a series of standalone Java applications, ranging from simple calculators to text-based games, emphasizing code readability, DRY principles, and modularity.',
   tradeoffs: 'Kept the scope of each project highly constrained to ensure perfect execution of foundational concepts rather than succumbing to feature bloat or external dependency reliance.',
   nextSteps: 'Refactor older procedural Java code into more modern, declarative functional-style Java streams to improve readability.'
  }
 },
 {
  slug: 'portfolio-website',
  year: '2024',
  title: 'Portfolio Website',
  stack: 'React, Tailwind CSS, Framer Motion',
  icons: ['react.svg', 'tailwind.svg'],
  link: 'https://github.com/haresham15/Haresh_Murugesan_Portfolio',
  caseStudy: {
   executiveSummary: 'The interactive portfolio you are currently browsing. A highly performant and visually striking personal website designed to showcase my engineering capabilities and design sensibilities.',
   problem: 'Standard resume PDFs and templated portfolios fail to capture the dynamic, interactive nature of modern web development and lack the engaging factors necessary to stand out to engineering teams.',
   architecture: 'Built from the ground up using React, heavily leveraging Framer Motion for complex, orchestration-heavy animations, and Tailwind CSS for a highly custom, responsive, glassmorphic aesthetic.',
   tradeoffs: 'Traded a standard, easily-scannable linear layout for a highly exploratory, narrative-driven experience. While this risks confusing some users, it deeply engages the target audience of technical recruiters and design engineers.',
   nextSteps: 'Continuously iterate on overall performance optimization, specifically regarding the WebGL and Canvas animation elements in the background to ensure a locked 60fps across lower-end mobile devices.'
  }
 },
 {
  slug: 'anna-birthday',
  year: '2024',
  title: 'A Birthday Website for my Brother!',
  stack: 'React, Tailwind CSS, JavaScript',
  icons: ['react.svg', 'tailwind.svg', 'javascript.svg'],
  link: 'https://github.com/haresham15/AnnaBirthdayWebsite',
  caseStudy: {
   executiveSummary: 'A personalized, interactive web experience built as a unique digital birthday gift, featuring embedded memories, mini-games, and customized animations.',
   problem: 'Physical gifts are fleeting. I wanted to build something permanent and highly personalized that also served as a practical demonstration of my growing web development skills.',
   architecture: 'Utilized React to build a snappy single-page application with interactive components, employing Tailwind CSS for rapid styling and flawless responsive design across mobile and desktop devices.',
   tradeoffs: 'Prioritized fun, flashy animations and immediate visual impact over strict WCAG accessibility guidelines, given the intended audience was a single, known user (my brother).',
   nextSteps: 'Open-source the underlying React template so others can easily generate and host their own personalized digital greeting cards via Vercel or GitHub Pages.'
  }
 }
];

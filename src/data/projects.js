export const spotlightProjects = [
 {
  slug: 'healios',
  title: 'Healios - AI Post-Surgical Recovery Assistant',
  description: 'Engineered a computer vision application utilizing a fine-tuned SAM (Segment Anything Model) to measure surgical wounds and allergy test wheals. Achieved 92% measurement accuracy, outperforming standard edge-detection algorithms by 40%.',
  icons: ['react.svg', 'python.svg', 'tensorflow.svg', 'tailwind.svg'],
  github: 'https://github.com/haresham15/healios',
  demo: '',
  image: '',
  caseStudy: {
   executiveSummary: 'Healios is a computer vision tool designed to assist in post-surgical recovery and allergy testing. By leveraging a fine-tuned SAM (Segment Anything Model), it achieves 92% accuracy in measuring wounds and wheals, drastically outperforming traditional edge-detection techniques.',
   problem: 'Standard post-surgical recovery relies heavily on infrequent in-person visits. Patients often misidentify early signs of infection, leading to readmissions. Existing computer vision solutions used rudimentary edge detection, which failed on varied skin tones and complex wound topologies.',
   architecture: 'I shifted from standard edge detection to leveraging a fine-tuned Segment Anything Model (SAM). By running inference in the cloud via FastAPI and optimizing the tensor operations, the model can accurately segment wheals and wound boundaries sent from a React client application.',
   tradeoffs: 'Using SAM drastically increased accuracy but introduced heavy inference latency compared to simple OpenCV scripts. I mitigated this by aggressive image downsampling before inference, trading a negligible 1% accuracy drop for a 3x speedup.',
   nextSteps: 'The model currently struggles with severe lighting variations and extreme shadows, causing false positives in edge detection. Next iteration involves data augmentation with simulated lighting conditions and implementing a pre-processing histogram equalization step.'
  }
 },
 {
  slug: 'ai-motorsports-hub',
  title: 'AIMotorsportsHub',
  description: 'Developed a real-time telemetry aggregation platform processing live race data from 20+ F1 sessions via the OpenF1 API. Architected a scalable hybrid-cloud solution utilizing AWS Lambda, Supabase, and Vercel, integrating the Gemini API for real-time predictive insights.',
  icons: ['react.svg', 'python.svg', 'javascript.svg'],
  github: 'https://github.com/haresham15/AIMotorsportsHub',
  demo: '',
  image: '',
  caseStudy: {
   executiveSummary: 'AIMotorsportsHub is a comprehensive, real-time telemetry dashboard for F1 enthusiasts. It aggregates live data from over 20 F1 sessions using a hybrid-cloud architecture and provides AI-driven insights via the Gemini API.',
   problem: 'Motorsports teams and enthusiasts lack accessible, unified dashboards for real-time telemetry. Aggregating 20+ F1 session data streams usually requires expensive enterprise software, and rendering this data on the web often results in severe latency issues.',
   architecture: 'I adopted a hybrid-cloud architecture to balance cost, speed, and complexity. The OpenF1 API feeds into AWS Lambda for initial processing, which stores historical aggregates in S3 and live state in Supabase, finally served to a Next.js frontend hosted on Vercel.',
   tradeoffs: 'Using a hybrid cloud (AWS + Supabase + Vercel) increased operational complexity and deployment friction. I could have built a monolith on a single VPS, but the hybrid approach allowed me to leverage generous free tiers and scale specific microservices independently.',
   nextSteps: 'Websocket connection drops during high-volume telemetry spikes are currently causing UI stuttering. I am actively researching Redis pub/sub implementations to buffer the stream and smooth out the delivery to the client.'
  }
 },
 {
  slug: 'dataio',
  title: 'DataIO - Hack To The Future',
  description: 'Award-winning project from the Hack To The Future hackathon. DataIO is a high-performance frontend data visualization tool engineered to seamlessly translate large-scale datasets into intuitive, interactive, and accessible UI components.',
  icons: ['javascript.svg', 'css.svg', 'react.svg'],
  github: 'https://github.com/haresham15/DataIO',
  demo: '',
  image: '',
  caseStudy: {
   executiveSummary: 'Developed during the Hack To The Future hackathon, DataIO is an accessible front-end tool designed to streamline data interpretation and translate large-scale information points into intuitive and user-friendly visualizations.',
   problem: 'Raw data is often presented in rigid, unreadable formats like massive spreadsheets, alienating non-technical users from critical insights and slowing down decision-making processes.',
   architecture: 'Built using React and CSS, DataIO consumes parsed JSON datasets and dynamically maps them to interactive visual components like charts and graphs via optimized rendering wrappers.',
   tradeoffs: 'We optimized for front-end rendering speed and immediate visual feedback, meaning the tool currently relies on pre-cleaned data and lacks robust backend validation for extremely malformed datasets.',
   nextSteps: 'The next iteration will integrate a Python backend (FastAPI + Pandas) to automatically clean and sanitize messy datasets before sending them to the frontend for visualization.'
  }
 },
 {
  slug: 'routerx',
  title: 'RouteRx - DataFest 2026 Winner',
  description: 'Awarded "Best Use of External Data" at DataFest 2026. RouteRx is a spatial data analytics platform that leverages advanced graph-traversal algorithms to process raw healthcare data, dynamically mapping optimal medication delivery routes for underserved regions.',
  icons: ['react.svg', 'python.svg', 'javascript.svg'],
  github: 'https://github.com/haresham15/RouteRx',
  demo: '',
  image: '',
  caseStudy: {
   executiveSummary: 'RouteRx translates raw healthcare accessibility data into actionable insights, utilizing a sophisticated graph-traversal algorithm to map optimal delivery routes for critical medication across underserved regions. It won Best Use of External Data at DataFest 2026.',
   problem: 'During DataFest 2026, our team was tasked with analyzing raw, unstructured data regarding healthcare accessibility. The core problem was identifying and quantifying \'healthcare deserts\'—regions where critical medication delivery fails due to inefficient routing and lack of infrastructure.',
   architecture: 'We utilized a graph-based routing algorithm combined with spatial data analysis using GeoPandas. We extracted millions of data points into a directed graph, weighting edges by transit time and historical failure rates, then visualized the optimized routes via a React frontend.',
   tradeoffs: 'Processing millions of geospatial data points entirely in Python caused memory bottlenecks on our laptops during the 48-hour hackathon. We opted to heavily pre-filter and aggregate the data into regional bounding boxes before rendering, sacrificing micro-level detail for macro-level performance.',
   nextSteps: 'The UI feels a bit static since the routing happens on the backend. I am currently working on open-sourcing the data processing pipeline so others can visualize their own city\'s data interactively within the browser using WebGL.'
  }
 },
];

export const archiveProjects = [
 {
  slug: 'nyc-housing-crisis-analysis',
  year: '2026',
  title: 'NYC Housing Crisis AI/ML Analysis',
  stack: 'FastAPI, Pandas, NumPy',
  link: '#',
  caseStudy: {
   executiveSummary: 'An analytical deep-dive into the NYC housing crisis, utilizing machine learning to predict housing trends and identify heavily impacted demographic sectors.',
   problem: 'Understanding the intricacies of the NYC housing market requires parsing massive datasets across multiple boroughs, making manual analysis impossible.',
   architecture: 'Leveraged Pandas and NumPy for extensive data cleaning and feature engineering, feeding into a scikit-learn model exposed via a FastAPI endpoint for quick querying.',
   tradeoffs: 'Prioritized model interpretability over raw accuracy by using simpler regression models rather than deep neural networks, making the insights more actionable for policymakers.',
   nextSteps: 'Integrate real-time real estate API feeds to keep the model updated with current market fluctuations.'
  }
 },
 {
  slug: 'syntinuum-podcast-website',
  year: '2026',
  title: 'Syntinuum Podcast Website',
  stack: 'JavaScript, React, Tailwind CSS',
  link: 'https://github.com/haresham15/Syntinuum_podcast_website',
  caseStudy: {
   executiveSummary: 'A dynamic, accessible, and highly performant web application built to host, stream, and catalog podcast episodes for the Syntinuum network.',
   problem: 'Off-the-shelf podcast hosts lacked the custom branding and interactive transcript features required for a highly engaging listener experience.',
   architecture: 'Built a completely bespoke frontend using React and Tailwind CSS, utilizing HTML5 audio APIs for seamless, uninterrupted playback across page navigations.',
   tradeoffs: 'Eschewed a heavy CMS in favor of a static JSON-driven architecture to maximize page load speeds and SEO performance.',
   nextSteps: 'Implement a headless CMS like Sanity to allow non-technical hosts to easily upload and manage new episodes.'
  }
 },
 {
  slug: 'philocracy',
  year: '2025',
  title: 'Philocracy Platform',
  stack: 'React, Tailwind CSS, JavaScript',
  link: 'https://github.com/haresham15/Philocracy',
  caseStudy: {
   executiveSummary: 'A platform aiming to democratize debate and philosophical discourse, providing tools for structured argumentation and community voting.',
   problem: 'Social media platforms reward outrage over nuanced discussion. There was a need for a platform that structurally enforces logical progression in debates.',
   architecture: 'Developed a React frontend with complex state management to handle nested argument trees, styled with Tailwind for a clean, distraction-free reading experience.',
   tradeoffs: 'Focused entirely on the frontend logic and structural flow for the MVP, relying on mock data rather than building out a complex real-time database backend.',
   nextSteps: 'Integrate Firebase or Supabase to enable real-time multiplayer debate mechanics and user authentication.'
  }
 },
 {
  slug: 'cs50-ai-projects',
  year: '2025',
  title: 'CS50 Intro to AI with Python',
  stack: 'Python, TensorFlow, NumPy',
  link: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
  caseStudy: {
   executiveSummary: 'A collection of artificial intelligence projects implementing graph search algorithms, reinforcement learning, and neural networks as part of Harvard\'s CS50 AI course.',
   problem: 'Gaining a foundational, from-scratch understanding of classical and modern AI algorithms requires hands-on implementation without relying on high-level abstraction libraries.',
   architecture: 'Implemented foundational algorithms including Minimax for game playing, Hidden Markov Models for probability, and custom feed-forward neural networks using raw Python and NumPy.',
   tradeoffs: 'Algorithms were optimized for educational clarity and correctness rather than production-grade execution speed.',
   nextSteps: 'Refactor select algorithms into a unified Python package to serve as an educational library for other students.'
  }
 },
 {
  slug: 'tutormatch',
  year: '2025',
  title: 'TutorMatch: AI-Powered Tutoring Platform',
  stack: 'Python, Streamlit, HuggingFace',
  link: 'https://github.com/haresham15/TutorMatch_WebApp',
  caseStudy: {
   executiveSummary: 'An AI-powered web application that intelligently matches students with optimal tutors based on learning styles, subject requirements, and availability.',
   problem: 'Students often struggle to find tutors that align with their specific learning pedagogies, leading to ineffective tutoring sessions.',
   architecture: 'Utilized a Streamlit frontend for rapid prototyping, hooked into a HuggingFace semantic similarity model to parse natural language student requests against tutor profiles.',
   tradeoffs: 'Relied on Streamlit for the UI which limited front-end customizability, but allowed for incredibly fast iteration on the underlying AI matching logic.',
   nextSteps: 'Migrate the frontend to Next.js for a more polished user experience and deploy the matching algorithm as a microservice.'
  }
 },
 {
  slug: 'carstomer',
  year: '2025',
  title: 'CarStomer: Car Value Analysis',
  stack: 'Python, Streamlit, Scikit-Learn',
  link: 'https://github.com/haresham15/CarStomerCarAnalysis',
  caseStudy: {
   executiveSummary: 'A data-driven application that predicts used car values based on historical market data, mileage, and condition metrics.',
   problem: 'The used car market is highly volatile, making it difficult for average consumers to determine if they are receiving a fair price without extensive research.',
   architecture: 'Trained a Random Forest regressor using Scikit-Learn on a dataset of over 100,000 vehicle sales, deployed interactively via Streamlit.',
   tradeoffs: 'Sacrificed some model precision on rare luxury vehicles due to lack of training data, focusing instead on high accuracy for standard commuter vehicles.',
   nextSteps: 'Incorporate real-time scraping of local dealership inventories to provide localized, up-to-the-minute price evaluations.'
  }
 },
 {
  slug: 'momwebsite',
  year: '2025',
  title: 'MomWebsite',
  stack: 'TypeScript, React, Vercel',
  link: 'https://github.com/haresham15/MomWebsite',
  caseStudy: {
   executiveSummary: 'A fast, responsive, and SEO-optimized business website built to showcase professional services and capture client leads.',
   problem: 'The previous web presence was outdated, slow to load, and suffered from poor search engine visibility, resulting in lost business opportunities.',
   architecture: 'Engineered a modern React application utilizing TypeScript for type safety and component reliability. Deployed on Vercel for global edge caching and lightning-fast load times.',
   tradeoffs: 'Opted for a bespoke React build rather than a template builder like Wix to maintain total control over performance and SEO metadata, at the cost of longer initial development time.',
   nextSteps: 'Integrate an automated email marketing pipeline to nurture the leads captured through the new contact forms.'
  }
 },
 {
  slug: 'murugesan-rajaram-lab',
  year: '2025',
  title: 'Murugesan Rajaram Lab Website',
  stack: 'TypeScript, React',
  link: 'https://github.com/haresham15/murugesan_rajaram_lab_website',
  caseStudy: {
   executiveSummary: 'An academic lab website designed to elegantly display research publications, team members, and ongoing scientific projects.',
   problem: 'Academic websites often suffer from dense, unreadable layouts. The lab required a clean, modern interface to attract prospective graduate students and grant funding.',
   architecture: 'Built with React and TypeScript, featuring a modular component system that allows for easy addition of new publications and team members via structured data files.',
   tradeoffs: 'Used static JSON files for data storage to keep hosting costs at zero, which requires a developer to update the site when new papers are published.',
   nextSteps: 'Connect the publications page to the PubMed API to automatically fetch and display new papers as they are released.'
  }
 },
 {
  slug: 'software-2-projects',
  year: '2024',
  title: 'Software 2 Engineering Projects',
  stack: 'Java',
  link: 'https://github.com/haresham15/Haresh-s-Software-2-Projects',
  caseStudy: {
   executiveSummary: 'A collection of advanced software engineering projects focusing on complex data structures, algorithmic efficiency, and object-oriented design patterns.',
   problem: 'Scaling applications requires a deep understanding of memory management, efficient data retrieval, and robust system architecture.',
   architecture: 'Implemented custom Collections, balanced trees, and graph algorithms in Java, strictly adhering to MVC architecture and comprehensive unit testing frameworks.',
   tradeoffs: 'Focused purely on backend logic and console interfaces rather than building GUIs, maximizing the time spent on algorithmic optimization.',
   nextSteps: 'Wrap the core logic of these projects in a Spring Boot API to expose them as web services.'
  }
 },
 {
  slug: 'software-1-projects',
  year: '2024',
  title: 'Software 1 Engineering Projects',
  stack: 'Java',
  link: 'https://github.com/haresham15/Software-Project-Java-Collection-',
  caseStudy: {
   executiveSummary: 'Foundational Java programming projects demonstrating core computer science concepts, object-oriented programming, and basic application development.',
   problem: 'Building robust software requires a strong grasp of syntax, control flow, and basic class hierarchies.',
   architecture: 'Developed a series of standalone Java applications, ranging from simple calculators to text-based games, emphasizing code readability and modularity.',
   tradeoffs: 'Kept the scope of each project highly constrained to ensure perfect execution of foundational concepts rather than feature bloat.',
   nextSteps: 'Refactor older procedural code into more modern, functional-style Java streams.'
  }
 },
 {
  slug: 'portfolio-website',
  year: '2024',
  title: 'Portfolio Website',
  stack: 'React, Tailwind CSS, JavaScript',
  link: 'https://github.com/haresham15/Haresh_Murugesan_Portfolio',
  caseStudy: {
   executiveSummary: 'The very website you are looking at. A highly interactive, performant, and visually striking personal portfolio designed to showcase my engineering capabilities.',
   problem: 'Standard resume PDFs and templated portfolios fail to capture the dynamic, interactive nature of modern web development and software engineering.',
   architecture: 'Built from the ground up using React, heavily leveraging Framer Motion for complex animations, and Tailwind CSS for a custom, glassmorphic cyberpunk aesthetic.',
   tradeoffs: 'Traded a standard, easily-scannable layout for a highly exploratory, narrative-driven experience. This risks confusing some users, but deeply engages the target audience of technical recruiters.',
   nextSteps: 'Continuously iterate on performance optimization, specifically regarding the WebGL/Canvas elements in the background to ensure 60fps on mobile devices.'
  }
 },
 {
  slug: 'anna-birthday',
  year: '2024',
  title: 'A Birthday Website for my Brother!',
  stack: 'React, Tailwind CSS, JavaScript',
  link: 'https://github.com/haresham15/AnnaBirthdayWebsite',
  caseStudy: {
   executiveSummary: 'A personalized, interactive web experience built as a unique digital birthday gift, featuring memories, games, and customized animations.',
   problem: 'Physical gifts are fleeting. I wanted to build something permanent and highly personalized that demonstrated my growing web development skills.',
   architecture: 'Utilized React to build a single-page application with interactive components, employing Tailwind CSS for rapid styling and responsive design across all devices.',
   tradeoffs: 'Prioritized fun, flashy animations over strict accessibility guidelines, given the audience was a single, known user (my brother).',
   nextSteps: 'Open-source the underlying template so others can easily generate personalized digital greeting cards.'
  }
 }
];

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '../../src/components/Header';
import ContactFooter from '../../src/components/ContactFooter';
import FractalGlassBackground from '../../src/components/FractalGlassBackground';

const AWSSkills = () => {
 const awsSkills = [
  {
   title: 'AWS Amplify',
   icon: 'aws-amplify.svg',
   description: 'Set of tools and services to build secure, scalable full stack applications.',
   color: '#FF9900'
  },
  {
   title: 'AWS Lambda',
   icon: 'aws-lambda.svg',
   description: 'Serverless compute service to run code without provisioning or managing servers.',
   color: '#FF9900'
  },
  {
   title: 'Amazon DynamoDB',
   icon: 'amazon-dynamodb.svg',
   description: 'Fast and flexible NoSQL database service for any scale.',
   color: '#4053D6'
  },
  {
   title: 'Amazon S3',
   icon: 'amazon-s3.svg',
   description: 'Object storage built to retrieve any amount of data from anywhere.',
   color: '#569A31'
  },
  {
   title: 'Amazon API Gateway',
   icon: 'amazon-api-gateway.svg',
   description: 'Create, maintain, and secure APIs at any scale.',
   color: '#FF4F8B'
  },
  {
   title: 'Amazon Cognito',
   icon: 'amazon-cognito.png',
   description: 'Add user sign-up, sign-in, and access control to web and mobile apps.',
   color: '#DD344C'
  },
  {
   title: 'Amazon CloudFront',
   icon: 'amazon-cloudfront.png',
   description: 'Fast, highly secure, and programmable content delivery network (CDN).',
   color: '#8C4FFF'
  },
  {
   title: 'Amazon Route 53',
   icon: 'amazon-route53.svg',
   description: 'Scalable and highly available Domain Name System (DNS) web service.',
   color: '#F58536'
  },
  {
   title: 'Amazon Bedrock',
   icon: 'amazon-bedrock.png',
   description: 'Fully managed service that makes foundation models available via an API.',
   color: '#00A4A6'
  },
  {
   title: 'AWS IAM',
   icon: 'aws-iam.svg',
   description: 'Securely manage access to AWS services and resources.',
   color: '#DD344C'
  },
  {
   title: 'Amazon EC2',
   icon: 'amazon-ec2.svg',
   description: 'Secure and resizable compute capacity in the cloud.',
   color: '#FF9900'
  }
 ];

 return (
  <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-charcoal">
   <Head>
    <title>AWS Ecosystem | Haresh Murugesan</title>
   </Head>
   <FractalGlassBackground />
   <Header />

   <main className="w-full max-w-7xl mx-auto px-4 py-32 relative z-10">
    <div className="mb-16">
     <Link href="/" className="inline-block text-cine-lavender hover:text-cine-teal transition-colors font-sans mb-8">
      ← Back to Home
     </Link>
     <motion.h1 
      className="text-6xl md:text-8xl font-heading tracking-widest uppercase font-bold tracking-tight text-light-gray mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
     >
      AWS Ecosystem
     </motion.h1>
     <motion.p 
      className="text-xl md:text-2xl text-light-gray/70 font-sans max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
     >
      A deep dive into the cloud infrastructure and serverless technologies I leverage to build scalable, resilient, and high-performance applications.
     </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {awsSkills.map((skill, idx) => (
      <motion.div 
       key={idx}
       className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-cine-teal transition-colors duration-300"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
       <div className="w-12 h-12 rounded-lg mb-6 flex items-center justify-center bg-white/5" style={{ filter: `drop-shadow(0 0 10px ${skill.color}40)` }}>
        <div 
         className="w-8 h-8"
         style={{
          backgroundColor: skill.color,
          WebkitMaskImage: `url(/icons/${skill.icon})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(/icons/${skill.icon})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center'
         }}
        />
       </div>
       <h3 className="text-2xl font-heading tracking-widest uppercase font-bold text-light-gray mb-3">
        {skill.title}
       </h3>
       <p className="text-light-gray/70 font-sans leading-relaxed">
        {skill.description}
       </p>
      </motion.div>
     ))}
    </div>
   </main>

   <ContactFooter />
  </div>
 );
};

export default AWSSkills;

import React from 'react';

export const CredibilityStrip: React.FC = () => {
  const credentials = [
    {
      label: 'Chemical Abstracts Service (CAS)',
      role: 'AI & Software Engineering Intern',
      metric: '12 Cloud Workflows · AWS Serverless',
      href: '#experience',
    },
    {
      label: 'Ohio State Digital Pathology AI Research',
      role: 'Undergraduate AI/ML Researcher',
      metric: 'Deep Vision & Segmentation Models',
      href: '#experience',
    },
    {
      label: 'Center for Innovation Strategies (Honda 99P Labs)',
      role: 'Innovation Data Analyst',
      metric: 'Mobility Telemetry & Spatial Analytics',
      href: '#experience',
    },
  ];

  return (
    <section className="w-full bg-[#050505] py-8 sm:py-10 border-b border-white/5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A6ADB8]/70 mb-4 text-center sm:text-left">
          Core Institutional & Research Affiliations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {credentials.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="group p-4 rounded-2xl bg-[#0D1118]/70 border border-white/5 hover:border-[#7DD3FC]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-mono text-[#7DD3FC] mb-1">
                  {item.role}
                </p>
                <h3 className="text-sm sm:text-base font-heading font-semibold text-white group-hover:text-[#7DD3FC] transition-colors leading-snug">
                  {item.label}
                </h3>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#A6ADB8]">
                <span>{item.metric}</span>
                <span className="text-[#7DD3FC] group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredibilityStrip;


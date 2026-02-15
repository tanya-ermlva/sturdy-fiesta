'use client';

import { motion } from 'motion/react';

interface SectionWrapperProps {
  id: string;
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  number,
  title,
  description,
  children,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="scroll-mt-24"
    >
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-accent-default">
          {String(number).padStart(2, '0')}
        </span>
        <h2 className="mt-1 text-2xl text-foreground-strong">{title}</h2>
        <p className="mt-2 text-foreground-muted leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
      {children}
    </motion.section>
  );
}

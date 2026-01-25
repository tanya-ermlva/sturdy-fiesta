'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number; // Delay between children in milliseconds
}

/**
 * ScrollReveal - Reveals children one by one as you scroll
 * Similar to the ScrollTextMotion demo, but for multiple children
 */
export default function ScrollReveal({ 
  children, 
  className = '',
  stagger = 50 
}: ScrollRevealProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = containerRef.current?.children;
            if (children) {
              // Reveal children one by one with stagger
              Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                  setVisibleCount((prev) => Math.max(prev, index + 1));
                }, index * stagger);
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [stagger]);

  return (
    <div ref={containerRef} className={className}>
      {React.Children.map(children, (child, index) => {
        const isVisible = index < visibleCount;
        return (
          <div
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: `${index * stagger}ms`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

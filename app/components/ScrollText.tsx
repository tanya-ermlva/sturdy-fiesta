'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollTextProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

export default function ScrollText({ 
  children, 
  delay = 0, 
  direction = 'fade',
  className = '' 
}: ScrollTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay before showing
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            // Once visible, we can stop observing
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  // Animation classes based on direction
  const getAnimationClass = () => {
    const baseTransition = 'transition-all duration-700 ease-out';
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${baseTransition} translate-y-8 opacity-0`;
        case 'down':
          return `${baseTransition} -translate-y-8 opacity-0`;
        case 'left':
          return `${baseTransition} translate-x-8 opacity-0`;
        case 'right':
          return `${baseTransition} -translate-x-8 opacity-0`;
        case 'fade':
        default:
          return `${baseTransition} opacity-0`;
      }
    }
    
    return `${baseTransition} translate-x-0 translate-y-0 opacity-100`;
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}

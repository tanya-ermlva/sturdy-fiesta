'use client';

import { useState, useCallback, useRef } from 'react';
import { projects } from '../data/projects';
import ProjectItem from './ProjectItem';

interface ProjectDistance {
  index: number;
  distance: number;
}

export default function ProjectList() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [projectScales, setProjectScales] = useState<number[]>(new Array(projects.length).fill(1));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const calculateDistances = useCallback((mouseX: number, mouseY: number) => {
    if (!listRef.current) return;

    const distances: ProjectDistance[] = [];
    const items = listRef.current.querySelectorAll('li');

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      // Calculate distance from mouse to the center of the item
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
      );
      distances.push({ index, distance });
    });

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance);

    // Calculate scales based on proximity
    const newScales = new Array(projects.length).fill(1);
    const newHoveredIndex = distances[0]?.index ?? null;

    if (distances.length > 0 && distances[0].distance < 200) {
      // Only scale if mouse is reasonably close
      // Closest gets largest scale
      if (distances[0]) newScales[distances[0].index] = 1.2;
      // Second closest gets medium scale
      if (distances[1] && distances[1].distance < 200) newScales[distances[1].index] = 1.1;
      // Third closest gets small scale
      if (distances[2] && distances[2].distance < 200) newScales[distances[2].index] = 1.05;
    }

    setProjectScales(newScales);
    setHoveredIndex(newHoveredIndex);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    calculateDistances(e.clientX, e.clientY);
  }, [calculateDistances]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
    setProjectScales(new Array(projects.length).fill(1));
    setHoveredIndex(null);
  }, []);

  return (
    <ul
      ref={listRef}
      className="space-y-0 text-sm sm:text-base md:text-lg lg:text-xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {projects.map((project, index) => (
        <ProjectItem
          key={project.slug}
          name={project.name}
          scale={projectScales[index]}
          showArrow={hoveredIndex === index}
          onMouseMove={handleMouseMove}
        />
      ))}
    </ul>
  );
}

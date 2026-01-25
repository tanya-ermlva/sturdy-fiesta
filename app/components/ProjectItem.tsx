'use client';

interface ProjectItemProps {
  name: string;
  scale: number;
  showArrow: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export default function ProjectItem({ name, scale, showArrow, onMouseMove }: ProjectItemProps) {
  return (
    <li
      className="relative transition-transform duration-300 ease-out origin-left leading-tight py-0.5"
      style={{ transform: `scale(${scale})` }}
      onMouseMove={onMouseMove}
    >
      <span className="inline-flex items-center gap-2 cursor-default select-none">
        {name}
        {showArrow && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-opacity duration-300 opacity-100 flex-shrink-0"
          >
            <path
              d="M1 6H11M11 6L7 2M11 6L7 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </li>
  );
}

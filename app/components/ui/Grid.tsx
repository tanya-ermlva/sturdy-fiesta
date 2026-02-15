import { cn } from '@/lib/utils'

export const Grid = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative flex h-[50rem] w-full items-center justify-center bg-background", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:auto,120px_120px]",
          "[background-image:repeating-linear-gradient(170deg,transparent,transparent_100px,#e4e4e7_100px,#e4e4e7_101px),linear-gradient(to_right,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:repeating-linear-gradient(170deg,transparent,transparent_100px,#262626_100px,#262626_101px),linear-gradient(to_right,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(circle,transparent_10%,black_50%)]"/>
    </div>
  );
};

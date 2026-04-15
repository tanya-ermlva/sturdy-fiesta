import Link from "next/link";
import { MediaItem } from "@/lib/mediaItems";

export default function GridItem({ item }: { item: MediaItem }) {
  return (
    <Link
      href={`/projects/${item.project}`}
      className="flex items-end gap-1 no-underline min-w-0"
    >
      {item.type === "video" ? (
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          className="flex-1 min-w-0 block"
        />
      ) : (
        <img src={item.src} alt={item.alt} className="flex-1 min-w-0 block" />
      )}
      <span className="shrink-0 text-xs font-mono leading-none">{item.id}</span>
    </Link>
  );
}

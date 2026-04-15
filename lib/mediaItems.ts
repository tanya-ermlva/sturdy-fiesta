export type MediaItem = {
  id: number;
  src: string;
  type: "image" | "video";
  project: string;
  alt: string;
};

// Generates a colored SVG rectangle — width/height set the aspect ratio
function rect(w: number, h: number, fill: string): string {
  const color = fill.replace("#", "%23");
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%25" height="100%25" fill="${color}"/></svg>`;
}

const mediaItems: MediaItem[] = [
  // Real media
  { id: 1,  src: "/docs/Tanya-Ermolaeva-1.jpg",  type: "image", project: "card-pn",  alt: "" },
  { id: 2,  src: "/docs/Tanya-Ermolaeva-2.png",  type: "image", project: "tnn",      alt: "" },
  { id: 3,  src: "/docs/Tanya-Ermolaeva-3.mp4",  type: "video", project: "together", alt: "" },
  { id: 4,  src: "/docs/Tanya-Ermolaeva-4.png",  type: "image", project: "tnn",      alt: "" },
  { id: 5,  src: "/docs/Tanya-Ermolaeva-5.png",  type: "image", project: "card-pn",  alt: "" },
  { id: 6,  src: "/docs/Tanya-Ermolaeva-6.mp4",  type: "video", project: "texture",  alt: "" },
  { id: 7,  src: "/docs/Tanya-Ermolaeva-7.png",  type: "image", project: "grid",     alt: "" },
  { id: 8,  src: "/docs/Tanya-Ermolaeva-8.mp4",  type: "video", project: "tnn",      alt: "" },
  { id: 9,  src: "/docs/Tanya-Ermolaeva-9.png",  type: "image", project: "together", alt: "" },
  { id: 10, src: "/docs/Tanya-Ermolaeva-10.png", type: "image", project: "card-pn",  alt: "" },
  { id: 11, src: "/docs/Tanya-Ermolaeva-11.mp4", type: "video", project: "texture",  alt: "" },
  { id: 12, src: "/docs/Tanya-Ermolaeva-12.png", type: "image", project: "tnn",      alt: "" },
  { id: 13, src: "/docs/Tanya-Ermolaeva-13.png", type: "image", project: "grid",     alt: "" },
  { id: 14, src: "/docs/Tanya-Ermolaeva-14.mp4", type: "video", project: "together", alt: "" },
  { id: 15, src: "/docs/Tanya-Ermolaeva-15.png", type: "image", project: "card-pn",  alt: "" },
  { id: 16, src: "/docs/Tanya-Ermolaeva-16.mp4", type: "video", project: "tnn",      alt: "" },
  { id: 17, src: "/docs/Tanya-Ermolaeva-17.png", type: "image", project: "texture",  alt: "" },
  { id: 18, src: "/docs/Tanya-Ermolaeva-18.png", type: "image", project: "grid",     alt: "" },
  { id: 19, src: "/docs/Tanya-Ermolaeva-19.mp4", type: "video", project: "tnn",      alt: "" },
  { id: 20, src: "/docs/Tanya-Ermolaeva-20.png", type: "image", project: "together", alt: "" },
  { id: 21, src: "/docs/Tanya-Ermolaeva-21.mp4", type: "video", project: "texture",  alt: "" },
  { id: 22, src: "/docs/Tanya-Ermolaeva-22.png", type: "image", project: "grid",     alt: "" },

  // Placeholders — coloured rectangles, varying proportions
  { id: 23, src: rect(400, 560, "#ffd6e4"), type: "image", project: "card-pn",  alt: "" }, // portrait  blush
  { id: 24, src: rect(400, 260, "#c2eeff"), type: "image", project: "tnn",      alt: "" }, // landscape sky
  { id: 25, src: rect(400, 400, "#d6f5c2"), type: "image", project: "together", alt: "" }, // square    lime
  { id: 26, src: rect(400, 480, "#f0d6ff"), type: "image", project: "grid",     alt: "" }, // portrait  lavender
  { id: 27, src: rect(400, 300, "#fff4b8"), type: "image", project: "texture",  alt: "" }, // landscape lemon
  { id: 28, src: rect(400, 520, "#ffc8b4"), type: "image", project: "card-pn",  alt: "" }, // portrait  coral
  { id: 29, src: rect(400, 280, "#c2f5ed"), type: "image", project: "tnn",      alt: "" }, // landscape mint
  { id: 30, src: rect(400, 400, "#ffe0c2"), type: "image", project: "together", alt: "" }, // square    orange
  { id: 31, src: rect(400, 460, "#d4e8ff"), type: "image", project: "grid",     alt: "" }, // portrait  periwinkle
  { id: 32, src: rect(400, 320, "#ffd4d4"), type: "image", project: "texture",  alt: "" }, // landscape pale red
  { id: 33, src: rect(400, 540, "#e8d5c4"), type: "image", project: "card-pn",  alt: "" }, // portrait  sand
  { id: 34, src: rect(400, 260, "#f5d4ff"), type: "image", project: "tnn",      alt: "" }, // landscape lilac
  { id: 35, src: rect(400, 400, "#d4ffe8"), type: "image", project: "together", alt: "" }, // square    seafoam
  { id: 36, src: rect(400, 500, "#fff0d4"), type: "image", project: "grid",     alt: "" }, // portrait  peach
  { id: 37, src: rect(400, 300, "#d4ffd4"), type: "image", project: "texture",  alt: "" }, // landscape pale green
  { id: 38, src: rect(400, 440, "#ffd4f0"), type: "image", project: "card-pn",  alt: "" }, // portrait  pink
  { id: 39, src: rect(400, 280, "#d4d4ff"), type: "image", project: "tnn",      alt: "" }, // landscape lilac-blue
  { id: 40, src: rect(400, 400, "#ffe8d4"), type: "image", project: "together", alt: "" }, // square    apricot
  { id: 41, src: rect(400, 520, "#d4fff0"), type: "image", project: "grid",     alt: "" }, // portrait  aqua
  { id: 42, src: rect(400, 340, "#ffecd4"), type: "image", project: "texture",  alt: "" }, // landscape warm cream
];

export default mediaItems;

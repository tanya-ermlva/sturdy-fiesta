export type MediaItem = {
  id: number;
  src: string;
  type: "image" | "video";
  project: string;
  alt: string;
};

const mediaItems: MediaItem[] = [
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
];

export default mediaItems;

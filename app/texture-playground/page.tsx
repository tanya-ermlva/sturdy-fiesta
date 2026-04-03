// app/texture-playground/page.tsx
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Texture Playground',
  robots: { index: false },
}

const TexturePlaygroundClient = dynamic(
  () => import('./TexturePlaygroundClient'),
  { ssr: false }  // PixiJS requires browser APIs
)

export default function TexturePage() {
  return <TexturePlaygroundClient />
}

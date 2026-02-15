import type { Metadata } from 'next';
import PlaygroundClient from './PlaygroundClient';

export const metadata: Metadata = {
  title: 'CSS Gradient Playground',
  description:
    'Interactive exploration of CSS gradients — linear, radial, conic, repeating, composition, and masking.',
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}

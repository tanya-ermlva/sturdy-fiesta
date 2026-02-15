import type { Metadata } from 'next';
import PositionPlaygroundClient from './PositionPlaygroundClient';

export const metadata: Metadata = {
  title: 'CSS Position Playground',
  description:
    'Interactive exploration of CSS position — static, relative, absolute, fixed, sticky, z-index, and real-world patterns.',
};

export default function PositionPlaygroundPage() {
  return <PositionPlaygroundClient />;
}

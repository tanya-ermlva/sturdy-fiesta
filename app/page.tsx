
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero';

export default function Home() {
  return (
    <main className="relative">
      <div className="z-50 fixed top-2 right-2"> <ThemeToggle /></div>
        <Hero />
    </main>
  );
}

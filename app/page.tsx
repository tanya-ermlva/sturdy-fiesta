
import ThemeToggle from './components/ui/ThemeToggle';
import Hero from './components/ui/Hero';
import { FloatingNav } from './components/ui/floating-navbar';

export default function Home() {
  return (
    <main className="relative">
      <div className="z-50 fixed top-2 right-2"> <ThemeToggle /></div>
      <Hero />
      <FloatingNav navItems = {[
        {name: 'Home', link: '/'},
        {name: 'Work', link: '/work'},
        {name: 'Playground', link: '/playground'},
        {name: 'Contact', link: '/contact'},
      ]}/>
    </main>
  );
}


import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <div>
      
        <div className="flex flex-col bg-surface p-10 rounded-lg">
       <h1 className="text-xl text-foreground">Tanya Ermolaeva</h1>
       <p className="text-sm text-foreground-muted">Product & Visual Designer</p>
       <div className="absolute top-2 right-2"> <ThemeToggle /></div>
      </div>
      </div>
    </main>
  );
}

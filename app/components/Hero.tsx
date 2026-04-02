import { Spotlight } from "@/app/components/ui/Spotlight";
import { Grid } from "./ui/Grid";

export default function Hero() {
  return (
    <div className="relative bg-background">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="grey"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vh]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vh]" fill="blue" />
      </div>
      <Grid className="absolute inset-0" />

      <div className="relative flex items-center justify-center h-screen">
        <div className="max-w-[89vw] flex flex-col items-center justify-center">
          <h2 className="text-foreground pb-4 text-4xl sm:text-7xl">
            Tanya Ermolaeva
          </h2>
          <h3 className="text-foreground-muted text-sm uppercase tracking-wider">
            Product & Visual Designer
          </h3>
        </div>
      </div>
    </div>
  );
}

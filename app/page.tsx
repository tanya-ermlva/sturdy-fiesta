import ProjectList from './components/ProjectList';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 md:py-16 lg:py-24">
        {/* Grid Container - Swiss Typography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 xl:gap-x-24 gap-y-12 md:gap-y-16">
          
          {/* Top Section - Left Column */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.2] tracking-tight">
              Tanya Ermolaeva
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4] tracking-tight">
              Product & Visual Designer
            </p>
          </div>

          {/* Top Section - Right Column */}
          <div className="space-y-1">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4] tracking-tight">
              I'm a designer who likes building tools for thoughts and creation.
            </p>
          </div>

          {/* Middle Section - Large Empty Space */}
          <div className="md:col-span-2 h-24 sm:h-32 md:h-48 lg:h-64 xl:h-80"></div>

          {/* Bottom Section - Left Column: Project List */}
          <div className="space-y-0">
            <ProjectList />
          </div>

          {/* Bottom Section - Right Column: Contact Info */}
          <div className="space-y-1">
            <div className="space-y-1 mb-6 md:mb-8">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4] tracking-tight">
                hi@ermolaeva.co
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4] tracking-tight">
                @ermlvaa
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4] tracking-tight">
                London, UK
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-[1.4] tracking-tight">
                January 2026
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

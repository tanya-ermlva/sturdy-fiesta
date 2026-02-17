export interface LearningNote {
  title: string;
  explanation: string;
  illustration?: {
    type: "code" | "diagram" | "demo";
    label?: string;
    content?: string;
    demoId?: string;
  };
}

export interface LearningCategory {
  category: string;
  subcategories: {
    name: string;
    notes: LearningNote[];
  }[];
}

export const learningNotes: LearningCategory[] = [
  {
    category: "CSS",
    subcategories: [
      {
        name: "Positioning",
        notes: [
          {
            title: "relative",
            explanation:
              "Makes an element a positioning anchor for its children. The element itself stays in normal flow — it doesn't move unless you add top/left/etc. Its main job is to let absolute-positioned children measure from it instead of the page.",
            illustration: {
              type: "code",
              label: "How relative + absolute work together",
              content: `<div class="relative">
  <!-- I'm the anchor -->
  <div class="absolute top-0 right-0">
    <!-- I measure from the relative parent -->
  </div>
</div>`,
            },
          },
          {
            title: "absolute",
            explanation:
              "Pulls an element out of normal flow entirely. It positions itself relative to the nearest ancestor that has position: relative (or absolute/fixed). If no ancestor is positioned, it uses the viewport. Use top/right/bottom/left to place it.",
            illustration: {
              type: "demo",
              label: "Absolute child anchored to relative parent",
              demoId: "positioning",
            },
          },
          {
            title: "Stacking contexts",
            explanation:
              "When you set position: relative or absolute on an element, it creates a stacking context. Elements with higher z-index values appear on top. Children are always stacked within their parent's context — you can't z-index your way out of a parent's layer.",
            illustration: {
              type: "diagram",
              label: "z-index stacking within a context",
              content: `┌──────────────────────────┐
│  Parent (relative)       │
│  ┌────────────────────┐  │
│  │ z-index: 3  TOP    │  │
│  ├────────────────────┤  │
│  │ z-index: 2         │  │
│  ├────────────────────┤  │
│  │ z-index: 1  BOTTOM │  │
│  └────────────────────┘  │
│                          │
│  Children can't escape   │
│  this stacking context   │
└──────────────────────────┘`,
            },
          },
          {
            title: "inset-0",
            explanation:
              "A shorthand for top: 0; right: 0; bottom: 0; left: 0 — it stretches an absolute-positioned element to fill its positioned parent completely. Think of it as 'cover the entire parent'.",
            illustration: {
              type: "demo",
              label: "inset-0 fills parent vs. specific positioning",
              demoId: "inset",
            },
          },
        ],
      },
      {
        name: "Layout",
        notes: [
          {
            title: "flex",
            explanation:
              "display: flex turns an element into a flex container. Its children become flex items that lay out in a row (default) or column. Flexbox handles spacing and alignment in one dimension at a time.",
            illustration: {
              type: "demo",
              label: "Flex row with centered items",
              demoId: "flex-axes",
            },
          },
          {
            title: "items-center",
            explanation:
              "align-items: center — aligns flex children along the cross axis (vertically in a row layout, horizontally in a column layout). Centers items perpendicular to the main direction.",
          },
          {
            title: "justify-center",
            explanation:
              "justify-content: center — centers flex children along the main axis (horizontally in a row, vertically in a column). Controls spacing in the same direction items flow.",
          },
          {
            title: "flex-col",
            explanation:
              "flex-direction: column — makes flex items stack vertically instead of the default horizontal row. When you switch to column, the main axis becomes vertical, so justify-content controls vertical spacing and align-items controls horizontal alignment.",
            illustration: {
              type: "demo",
              label: "flex-col swaps the axes",
              demoId: "flex-col",
            },
          },
        ],
      },
      {
        name: "Fixed positioning",
        notes: [
          {
            title: "fixed",
            explanation:
              "position: fixed removes an element from the document flow and positions it relative to the viewport (the browser window). It stays in place when you scroll — that's how sticky navbars, floating buttons, and cookie banners work. Use top/right/bottom/left to place it.",
          },
          {
            title: "Centering a fixed element horizontally",
            explanation:
              "The trick: fixed + inset-x-0 + mx-auto + max-w-fit. inset-x-0 sets left:0 and right:0, giving the element a full-width positioning context. max-w-fit shrinks it to content size. mx-auto centers it within that full-width context. Without inset-x-0, mx-auto has nothing to center within.",
            illustration: {
              type: "code",
              label: "The fixed centering combo",
              content: `<div class="fixed top-10 inset-x-0 mx-auto max-w-fit">
  <!-- left:0 + right:0 = full-width context -->
  <!-- max-w-fit = shrink to content -->
  <!-- mx-auto = center within that context -->
</div>`,
            },
          },
        ],
      },
      {
        name: "Gradients",
        notes: [
          {
            title: "Gradient as decorative line",
            explanation:
              "You can use a 1px-tall gradient as a glowing underline effect. bg-gradient-to-r creates a left-to-right gradient. from-transparent via-blue-500 to-transparent means: start invisible, peak at blue in the middle, fade back to invisible. Combined with h-px (1px height) and absolute positioning, it creates a subtle glow line under an element.",
            illustration: {
              type: "code",
              label: "Gradient glow underline",
              content: `<span class="absolute inset-x-0 -bottom-px
  w-1/2 mx-auto h-px
  bg-gradient-to-r from-transparent
  via-blue-500 to-transparent" />`,
            },
          },
        ],
      },
    ],
  },
  {
    category: "Tailwind",
    subcategories: [
      {
        name: "Basics",
        notes: [
          {
            title: "Utility classes",
            explanation:
              "Tailwind uses single-purpose classes that each do one thing: bg-red-500 sets background color, p-4 sets padding, text-lg sets font size. You compose them together instead of writing custom CSS. The class names follow a pattern: property-value.",
            illustration: {
              type: "code",
              label: "Composing utilities",
              content: `<!-- Each class does one thing -->
<button class="bg-violet-500 text-white px-4 py-2 rounded-lg">
  Click me
</button>`,
            },
          },
          {
            title: "Arbitrary values with []",
            explanation:
              "When Tailwind's preset values don't have what you need, use square brackets for any CSS value: w-[89vw], top-[137px], bg-[#1a1a2e]. These compile to real CSS with that exact value. Use them sparingly — preset values keep designs consistent.",
          },
          {
            title: "Responsive prefixes (md:, sm:)",
            explanation:
              "Tailwind is mobile-first: unprefixed classes apply to all screens. Prefixes like sm: (640px+), md: (768px+), lg: (1024px+) apply only at that breakpoint and above. So 'text-sm md:text-lg' means small text on mobile, large text on medium screens and up.",
            illustration: {
              type: "demo",
              label: "Mobile-first responsive sizing",
              demoId: "responsive",
            },
          },
          {
            title: "Negative values (-top-40)",
            explanation:
              "Prefix a spacing utility with a dash to get a negative value: -top-40 is top: -10rem, -mt-4 is margin-top: -1rem. Useful for pulling elements outside their normal bounds, like overlapping sections.",
          },
        ],
      },
      {
        name: "Spacing",
        notes: [
          {
            title: "h-screen",
            explanation:
              "Sets height: 100vh — the full height of the viewport (the visible browser window). Useful for making a section take up exactly one screen. Note: on mobile browsers, 100vh can be taller than the visible area because of the address bar.",
          },
          {
            title: "max-w-[89vw]",
            explanation:
              "Sets the maximum width to 89% of the viewport width. The element can be narrower but never wider. Arbitrary value in brackets because 89vw isn't a Tailwind preset. Good for constraining content width while keeping it responsive.",
          },
          {
            title: "px-5 and mx-auto",
            explanation:
              "px-5 adds 1.25rem of horizontal padding (left and right). mx-auto sets left and right margins to auto, which centers a block element horizontally within its parent. They're often used together: mx-auto centers the box, px-5 adds breathing room inside it.",
            illustration: {
              type: "demo",
              label: "mx-auto centers with auto margins",
              demoId: "spacing",
            },
          },
        ],
      },
      {
        name: "Dark mode",
        notes: [
          {
            title: "Semantic tokens vs dark: prefix",
            explanation:
              "If your design system uses semantic tokens (bg-background, text-foreground-muted, border-border-default), you never need the dark: prefix — the CSS variable swaps automatically when .dark is on <html>. You only need dark: when using raw Tailwind colors like bg-white or text-neutral-600, because those don't change with theme. How to tell them apart: semantic tokens use role words (background, foreground, surface, accent, border) — these are your CSS variables defined in globals.css. Raw Tailwind colors use color words (white, black, neutral, violet, red) — these are fixed values from Tailwind's palette. Rule: role word = auto-switches. Color word = stuck, needs dark: prefix.",
            illustration: {
              type: "code",
              label: "Semantic tokens auto-switch, raw colors don't",
              content: `<!-- Semantic tokens: automatic, no dark: needed -->
<div class="bg-background text-foreground-muted">

<!-- Raw colors: must handle both modes manually -->
<div class="bg-white dark:bg-black text-neutral-600 dark:text-neutral-50">`,
            },
          },
        ],
      },
    ],
  },
  {
    category: "Architecture",
    subcategories: [
      {
        name: "Next.js Project Structure",
        notes: [
          {
            title: "Folders = URLs (file-based routing)",
            explanation:
              "Next.js App Router uses your folder structure as your website's URL structure. Every folder inside app/ that contains a page.tsx becomes a visitable URL. No config, no router setup — you make a folder, put a page.tsx in it, and the URL exists. Delete the folder and the URL disappears.",
            illustration: {
              type: "diagram",
              label: "Folders map directly to URLs",
              content: `app/
├── page.tsx                ──▶  yoursite.com/
├── memo/
│   └── page.tsx            ──▶  yoursite.com/memo
├── playground/
│   └── page.tsx            ──▶  yoursite.com/playground
└── components/             ──▶  NOT a URL (no page.tsx)`,
            },
          },
          {
            title: "page.tsx — what people see",
            explanation:
              "page.tsx answers: 'What do people see when they visit this URL?' It's the only file that creates a route. The function name inside doesn't matter — it could be called Banana — but the file MUST be named page.tsx. Every other .tsx file in the folder (components, helpers) is invisible to the router.",
          },
          {
            title: "layout.tsx — the frame around pages",
            explanation:
              "layout.tsx is the picture frame that wraps every page. It contains the <html>, <body>, global CSS, fonts, and scripts that every page needs. The {children} prop is a placeholder — it gets swapped out depending on which page you're visiting. When you navigate between pages, the layout stays and only the page content changes, making navigation fast.",
            illustration: {
              type: "diagram",
              label: "Layout wraps pages like a picture frame",
              content: `┌─ layout.tsx (the frame) ──────────┐
│  <html>                           │
│  <body>                           │
│    ┌───────────────────────────┐  │
│    │  {children}               │  │
│    │  ▲ swapped per URL:       │  │
│    │  / ──▶ Home content       │  │
│    │  /playground ──▶ Gradient │  │
│    │  /memo ──▶ Learning notes │  │
│    └───────────────────────────┘  │
│  </body>                          │
│  </html>                          │
└───────────────────────────────────┘`,
            },
          },
          {
            title: "Three rules of Next.js routing",
            explanation:
              "1) Folder + page.tsx = a URL people can visit. 2) layout.tsx = the wrapper around pages (the frame stays, the painting changes). 3) Everything else (components/, data/, helpers) = just files, not pages. Only page.tsx creates routes, only layout.tsx wraps them.",
          },
        ],
      },
      {
        name: "Component patterns",
        notes: [
          {
            title: "Layered stacking pattern",
            explanation:
              "A common UI pattern: a relative-positioned wrapper contains multiple absolute-positioned children that overlap. Layer 1 (bottom): decorative backgrounds or gradients. Layer 2 (middle): effects like spotlights or blurs. Layer 3 (top): actual content with the highest z-index. Each layer uses inset-0 to fill the wrapper.",
            illustration: {
              type: "diagram",
              label: "Layered stacking: wrapper with overlapping layers",
              content: `┌─ wrapper (relative) ─────────────┐
│                                  │
│  ┌─ z-10: content ────────────┐  │
│  │  Text, buttons, etc.       │  │
│  └────────────────────────────┘  │
│  ┌─ z-5: effects ─────────────┐  │
│  │  Spotlight, blur, glow     │  │
│  └────────────────────────────┘  │
│  ┌─ z-0: background ──────────┐  │
│  │  Gradient, image, color    │  │
│  └────────────────────────────┘  │
│                                  │
│  All children: absolute inset-0  │
└──────────────────────────────────┘`,
            },
          },
        ],
      },
    ],
  },
  {
    category: "Animation & JS",
    subcategories: [
      {
        name: "Scroll-based behavior",
        notes: [
          {
            title: "Detecting scroll direction",
            explanation:
              "To know if the user is scrolling up or down: compare the current scroll position to the previous one. current - previous gives you direction: negative = scrolling up (position decreasing), positive = scrolling down. Framer Motion's useScroll gives you scrollYProgress (0 at top, 1 at bottom) and getPrevious() to get the last value.",
            illustration: {
              type: "code",
              label: "Scroll direction from position delta",
              content: `let direction = current - previous;
// direction < 0 → scrolling UP
// direction > 0 → scrolling DOWN

// Common UX pattern:
// Scroll down → hide nav (user is reading)
// Scroll up → show nav (user wants to navigate)`,
            },
          },
        ],
      },
      {
        name: "Framer Motion basics",
        notes: [
          {
            title: "motion.div — initial, animate, transition",
            explanation:
              "Wrap any HTML element with motion. (like motion.div) to make it animatable. Three key props: initial = starting state on mount. animate = target state (updates when values change). transition = how to get there (duration, easing). Motion automatically tweens between initial and animate values. When animate changes (e.g. from a state variable), it re-animates smoothly.",
            illustration: {
              type: "code",
              label: "Basic motion.div animation",
              content: `<motion.div
  initial={{ opacity: 0, y: -100 }}   // start: invisible, 100px above
  animate={{ opacity: 1, y: 0 }}      // end: visible, natural position
  transition={{ duration: 0.2 }}       // take 0.2 seconds
/>`,
            },
          },
          {
            title: "AnimatePresence",
            explanation:
              "Normally, when React removes an element from the DOM, it vanishes instantly. AnimatePresence wraps elements and lets them animate out before being removed. mode='wait' means: finish the exit animation before starting the enter animation of the next element.",
          },
        ],
      },
      {
        name: "Responsive patterns",
        notes: [
          {
            title: "Responsive swap (icon on mobile, text on desktop)",
            explanation:
              "A common pattern: show an icon on small screens, swap to text on larger screens. Use hidden + sm:block on the text span (hidden by default, visible at sm:). Use block + sm:hidden on the icon span (visible by default, hidden at sm:). Both elements are always in the DOM — CSS just toggles visibility.",
            illustration: {
              type: "code",
              label: "Show icon on mobile, text on desktop",
              content: `<span class="block sm:hidden">{icon}</span>
<span class="hidden sm:block">{text}</span>

<!-- Mobile: icon visible, text hidden -->
<!-- sm+:    icon hidden, text visible -->`,
            },
          },
        ],
      },
    ],
  },
  {
    category: "Tools",
    subcategories: [
      {
        name: "How screens work",
        notes: [
          {
            title: "Screens use frames, just like cinema",
            explanation:
              "Both cinema and computer screens show static images one after another. Your brain perceives rapid succession as smooth motion (persistence of vision). Cinema: 24fps, physical film frames, with black gaps between them. Computer screens: 60–120fps, each frame generated in real-time by the GPU as a grid of pixels. Key difference: cinema replays pre-recorded frames; a computer calculates each frame on the fly (e.g. when you move a mouse, the GPU renders the cursor in its new position within ~8ms).",
            illustration: {
              type: "diagram",
              label: "How a CSS animation becomes pixels",
              content: `Browser: requestAnimationFrame (60×/sec)
  │
  ▼
Calculate animation value (e.g. width: 65px → 73px)
  │
  ▼
GPU renders new frame (full screen of pixels)
  │
  ▼
Display shows frame  ──▶  Your brain sees "smooth motion"

Why 60fps not 24? Cinema has motion blur baked into each
frame (camera shutter). Screens render sharp pixels — need
more frames to look smooth. Apple ProMotion = 120fps.`,
            },
          },
        ],
      },
      {
        name: "macOS",
        notes: [
          {
            title: "Screenshot to clipboard",
            explanation:
              "Cmd+Shift+Control+3 captures the full screen to your clipboard (not a file). Cmd+Shift+Control+4 lets you select a region to clipboard. Without the Control key, screenshots save as files to your desktop. Clipboard is faster for pasting into chats or docs.",
          },
        ],
      },
      {
        name: "Vercel",
        notes: [
          {
            title: "Deployment URL naming",
            explanation:
              "Vercel auto-generates a unique URL for every deployment: [project]-[hash]-[account-slug].vercel.app. The project name comes from your Vercel project settings. The hash is random and unique per deploy. The account slug is auto-generated from your Vercel username. Each deploy gets its own URL so you can preview any version. The alias URL (like portfolio-three-alpha-65.vercel.app) is stable and always points to the latest production deploy.",
            illustration: {
              type: "diagram",
              label: "Anatomy of a Vercel deployment URL",
              content: `portfolio-81ucrn3xc-tanyas-projects-d75a0fbc.vercel.app
─────────┬──────────┬────────────────────────┬──────────
         │          │                        │
   project name   unique hash      account/team slug`,
            },
          },
        ],
      },
      {
        name: "CSS / Fonts",
        notes: [
          {
            title: "Safari font weight synthesis",
            explanation:
              "If you use font-bold (weight 700) but only have a Medium (500) font file loaded, Safari will synthesize the missing weight by artificially thickening the glyphs — making text look bloated and distorted. Chrome is more subtle about it. Fix: only use font weights you actually have font files for, or load additional weight variants.",
          },
        ],
      },
    ],
  },
  {
    category: "Animation (Framer Motion)",
    subcategories: [
      {
        name: "Core Concepts",
        notes: [
          {
            title: "motion.div — animated HTML elements",
            explanation:
              "The motion library gives you special versions of HTML elements (motion.div, motion.span) and SVG elements (motion.rect). They work exactly like normal elements but can smoothly animate any property you put in their `animate` prop. When the animate value changes, motion interpolates from the old value to the new one automatically.",
          },
          {
            title: "Springs vs duration-based transitions",
            explanation:
              "Duration-based: 'go from A to B in 0.3 seconds' — fixed timeline. Spring-based: 'go from A to B like a physical spring' — physics simulation. Springs are interruptible: if the user triggers a reverse mid-animation, the spring naturally changes direction from wherever it currently is. Duration animations snap or feel jerky when interrupted. Use springs for interactive UI (hover, click). Use duration for continuous loops (tickers, loading indicators).",
          },
          {
            title: "stiffness and damping",
            explanation:
              "Two knobs that control how a spring feels. Stiffness (default 100): how fast it moves — higher = snappier, like a tight rubber band. Damping (default 10): how quickly it settles — higher = less bounce/overshoot. Common combo for snappy UI: stiffness 400, damping 30. For softer settling: stiffness 300, damping 28.",
          },
          {
            title: "animate prop with state",
            explanation:
              "Put a state-derived value in the animate prop: animate={{ width: hovered ? 300 : 120 }}. When state changes, React re-renders, motion sees the new target value, and springs toward it. You never write the in-between frames — the library handles interpolation.",
          },
          {
            title: "Keyframe arrays",
            explanation:
              "Pass an array to animate between multiple values: animate={{ scaleY: [0.3, 1, 0.3] }}. Motion will animate through each value in sequence. Combined with repeat: Infinity, this creates loops. Combined with ease: 'easeInOut', the animation slows at each keyframe and speeds up between them.",
          },
        ],
      },
      {
        name: "SVG Animation",
        notes: [
          {
            title: "originY for centered scaling",
            explanation:
              "By default, scaleY transforms from the top edge (originY: 0%). Set style={{ originY: '50%' }} to scale from the center — the element grows equally up and down. Essential for waveform bars that should pulse from their midpoint.",
          },
          {
            title: "Staggered delays for organic motion",
            explanation:
              "When animating multiple similar elements (like waveform bars), give each a slightly different delay (delay: i * 0.08) and duration. This creates a wave effect where elements don't move in lockstep. Looks organic instead of robotic.",
          },
        ],
      },
      {
        name: "Patterns",
        notes: [
          {
            title: "Ticker / marquee scroll",
            explanation:
              "To create an infinitely scrolling text ticker: 1) Duplicate the text content. 2) Animate x from 0 to negative half the total width. 3) Use repeat: Infinity, ease: 'linear'. 4) Wrap in a container with overflow-hidden. The duplication creates the illusion — when the first copy scrolls away, the second copy seamlessly takes its place.",
          },
          {
            title: "use client directive for interactive components",
            explanation:
              "Next.js defaults to Server Components (rendered on the server, no JavaScript sent to browser). Any component using useState, event handlers (onClick, onMouseEnter), or animation libraries must have 'use client' at the top. This tells Next.js to include the component's JavaScript in the browser bundle so it can be interactive.",
          },
        ],
      },
    ],
  },
];

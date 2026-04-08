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

export interface FlatCard {
  category: string;
  subcategory: string;
  title: string;
  explanation: string;
  illustration?: LearningNote["illustration"];
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
        name: "Server vs Client Components",
        notes: [
          {
            title: "What is 'the server' in Next.js?",
            explanation:
              "Every website involves two computers: a server (holds and builds the site) and your browser (displays it). In Next.js dev mode, the server is Node.js running on your own laptop at localhost:3000 — your browser talks to your own machine. In production (Vercel), the server is Vercel's computers in a data centre. The browser talks to them over the internet.",
            illustration: {
              type: "diagram",
              label: "Dev vs production server",
              content: `DEV                         PRODUCTION
───                         ──────────
Your laptop                 Vercel's computer
  │ localhost:3000             │ yoursite.vercel.app
  └──▶ Your browser            └──▶ Anyone's browser`,
            },
          },
          {
            title: "Server Component vs Client Component — the kitchen analogy",
            explanation:
              "Server Component = kitchen cooking. The server runs your code, produces finished HTML, and sends only the result to the browser. No JavaScript ships. Database passwords and API keys stay on the server — safe. Fast. Client Component ('use client') = tableside cooking. Your JavaScript code travels to the browser, React runs it there, and the page becomes interactive. Heavier, but necessary for anything the user can interact with.",
            illustration: {
              type: "diagram",
              label: "What each type sends to the browser",
              content: `SERVER COMPONENT
  Server runs code → produces HTML
  Browser receives: <div><h1>Hello</h1></div>
  Zero JavaScript shipped. Fast.

CLIENT COMPONENT ('use client')
  Server sends HTML shell + JavaScript bundle
  React runs IN THE BROWSER
  Hooks work. Clicks work. Animations work.`,
            },
          },
          {
            title: "When to use Server vs Client",
            explanation:
              "The decision rule: does this component need to respond to the user? If yes → Client ('use client'). If no → Server (default, no directive needed). Client needs: onClick/onChange/onHover, useState/useEffect/useRef, Framer Motion animations, browser APIs (clipboard, localStorage), real-time updates. Server is good for: static text and layout, fetching data from a database or API, using secret keys/environment variables, most of your page content.",
            illustration: {
              type: "diagram",
              label: "Decision tree",
              content: `Does this component respond to the user?
         │
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
  CLIENT    SERVER
'use client'  (default)`,
            },
          },
          {
            title: "Best practice: push 'use client' as deep as possible",
            explanation:
              "The worst thing you can do is mark page.tsx itself as 'use client' — now the entire page ships as JavaScript. The browser has to download, parse, and run it all before showing anything. Best practice: keep the top of your tree as Server Components. Only mark the specific small components that need interactivity. Everything above the 'use client' boundary stays fast, free HTML.",
            illustration: {
              type: "diagram",
              label: "Good vs bad boundary placement",
              content: `GOOD — boundary deep in the tree
page.tsx         [SERVER] ← whole page fast
└── Layout       [SERVER] ← layout fast
    └── Article  [SERVER] ← content fast
    └── LikeBtn  [CLIENT] ← only this ships JS

BAD — boundary at the root
page.tsx [CLIENT] ← entire page ships as JS
└── Layout       ← contaminated
    └── Article  ← contaminated
    └── LikeBtn  ← contaminated`,
            },
          },
          {
            title: "'use client' contaminates downward, not upward",
            explanation:
              "When you mark a file 'use client', that file AND everything it imports becomes a client component. The contamination flows downward through the import tree. But components above it in the tree are unaffected — they stay as server components. This is why placing 'use client' on bento-grid.tsx (deep in the tree) only makes the bento grid client-side, while page.tsx and bento-grid-wrapper.tsx stay as fast server components.",
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
        name: "JavaScript Fundamentals",
        notes: [
          {
            title: "Objects — labelled boxes for grouped data",
            explanation:
              "An object is a collection of key-value pairs wrapped in curly braces. Each key is a label (string), each value is anything: a string, number, array, even another object. You access values with dot notation (tanya.name) or bracket notation (tanya['name']). Objects are how JavaScript groups related data — and props in React are always objects under the hood.",
            illustration: {
              type: "code",
              label: "Creating and reading an object",
              content: `const tanya = {
  name: "Tanya",
  role: "designer",
  company: "Granola",
  tools: ["Figma", "React"]
}

tanya.name      // "Tanya"
tanya.role      // "designer"
tanya.tools[0]  // "Figma"  (arrays inside objects)`,
            },
          },
          {
            title: "Destructuring — pulling values out of an object",
            explanation:
              "Destructuring is a shortcut for extracting values from an object into standalone variables. The curly braces on the LEFT side of = are the template — they say 'pull these keys out'. The names must match the object's keys exactly. It's identical to writing const name = tanya.name on separate lines, just shorter. This is what you see in every React component's parameter list.",
            illustration: {
              type: "code",
              label: "Three ways to write the same thing",
              content: `const tanya = { name: "Tanya", role: "designer" }

// Long way
const name = tanya.name
const role = tanya.role

// Destructuring — same result, one line
const { name, role } = tanya

// In a function parameter — inline destructuring
function greet({ name, role }) {
  console.log(name, role)  // "Tanya" "designer"
}
greet(tanya)`,
            },
          },
          {
            title: "Destructuring and props are the same mechanism",
            explanation:
              "React props are just an object. When you write <Card title='Hi' />, React calls Card({ title: 'Hi' }). The { title, description } in a component's parameters is plain JavaScript destructuring of that object — not React magic. Understanding this means you already understand props if you understand destructuring.",
            illustration: {
              type: "code",
              label: "Props object = object destructuring",
              content: `// React passes this object to your component:
// { title: "Design systems", description: "Tokens..." }

// Without destructuring:
function Card(props) {
  return <h3>{props.title}</h3>
}

// With destructuring (identical, just cleaner):
function Card({ title, description }) {
  return <h3>{title}</h3>
}`,
            },
          },
          {
            title: "Arrow function syntax — four forms",
            explanation:
              "Arrow functions are a shorthand for writing functions in JavaScript. All four forms do the same thing — pick the shortest one that's still readable. Form 1 (full body): (item) => { return item.title } — most explicit, use when learning. Form 2 (implicit return): (item) => item.title — no curly braces means 'return this expression'. Form 3 (no parens on single param): item => item.title. Form 4 (returning an object): (item) => ({ id: item.id }) — wrapping in () stops JS confusing {} for a code block.",
            illustration: {
              type: "code",
              label: "Four ways to write the same arrow function",
              content: `// Form 1: full body — most explicit
(item) => { return item.title }

// Form 2: implicit return — no {} means "return this"
(item) => item.title

// Form 3: single param, no parentheses
item => item.title

// Form 4: returning an object — () stops {} being read as a block
(item) => ({ id: item.id, title: item.title })`,
            },
          },
          {
            title: ".map() — transform every item, same length in → out",
            explanation:
              "The most used array method in React. Loops over every item, runs your function on each one, and returns a new array of the results. The original array is unchanged. In React, you map over data arrays to produce arrays of components. Always needs a key prop on the outermost element when used in JSX.",
            illustration: {
              type: "code",
              label: "JS then React",
              content: `// JS: transform objects into strings
const titles = projects.map((p) => p.title)
// ["Granola", "Portfolio", "LeadDay", "Design system"]

// React: transform objects into components
projects.map((p) => (
  <Card key={p.id} title={p.title} />
))
// key= is required — React uses it to track list items`,
            },
          },
          {
            title: ".filter() — keep items that pass a test, shorter array out",
            explanation:
              "The function you pass must return true (keep this item) or false (drop it). Returns a new shorter array — never modifies the original. In React, filter before you map to show only matching items. ! means NOT: !project.done means 'where done is false'.",
            illustration: {
              type: "code",
              label: "JS then React",
              content: `// Keep only personal projects
projects.filter((p) => p.type === "personal")

// Keep only unfinished (! means NOT)
projects.filter((p) => !p.done)

// React: filter then map — the most common pattern
projects
  .filter((p) => p.type === activeCategory)
  .map((p) => <Card key={p.id} title={p.title} />)`,
            },
          },
          {
            title: ".find() — returns the first match as a single item",
            explanation:
              "Like filter but stops at the first match and returns the item itself, not an array. Returns undefined if nothing matches. Use ?. (optional chaining) when accessing properties on the result in case it's undefined: found?.title won't crash if found is undefined.",
            illustration: {
              type: "code",
              label: "find returns an item, not an array",
              content: `const portfolio = projects.find((p) => p.id === 2)
// { id: 2, title: "Portfolio site", ... }  ← the item itself

const missing = projects.find((p) => p.id === 99)
// undefined  ← nothing matched

// Safe access with optional chaining
portfolio?.title   // "Portfolio site" or undefined (no crash)`,
            },
          },
          {
            title: ".some() and .every() — yes/no questions about an array",
            explanation:
              ".some() returns true if at least one item passes the test. .every() returns true only if ALL items pass. Both return a boolean, never an array. Useful for conditional UI: show a banner if some items are unread, disable a button if not every field is filled.",
            illustration: {
              type: "code",
              label: "Asking boolean questions",
              content: `projects.some((p) => !p.done)   // true — at least one unfinished
projects.every((p) => p.done)  // false — not all done

// In React:
{projects.some((p) => !p.done) && <Banner text="You have unfinished work" />}`,
            },
          },
          {
            title: ".reduce() — collapse an array into a single value",
            explanation:
              "Takes two arguments: a callback and a starting value. The callback receives (accumulator, currentItem) — the accumulator is your running result, starting from the starting value. Use it to sum numbers, count items, or group data into an object. Less common in UI rendering but essential for aggregating data.",
            illustration: {
              type: "code",
              label: "Sum hours across all projects",
              content: `const total = projects.reduce((acc, p) => acc + p.hours, 0)
//                              └──┘  └┘   └──────────┘  └┘
//                         accumulator each  add this       start
//                         (running sum) item  item's hours  at 0

// total = 77`,
            },
          },
        ],
      },
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
  {
    category: "React & The Browser",
    subcategories: [
      {
        name: "The DOM",
        notes: [
          {
            title: "What is the DOM?",
            explanation:
              "When a browser loads a webpage, it reads the HTML and builds a live tree of every element in memory. That tree is called the DOM — Document Object Model. Think of it like Figma's layers panel: a nested hierarchy of every element on screen. The browser uses this tree to decide what to paint. JavaScript can reach into the tree and change nodes at runtime — that's how interactive UIs work.",
            illustration: {
              type: "diagram",
              label: "HTML becomes a tree in memory",
              content: `Your HTML                  The DOM (in memory)
──────────                 ──────────────────
<html>                     document
  <body>                   └── <html>
    <section>       ──▶        └── <body>
      <h1>Hello</h1>               └── <section>
      <p>World</p>                      ├── <h1> "Hello"
    </section>                          └── <p> "World"
  </body>
</html>`,
            },
          },
        ],
      },
      {
        name: "JSX",
        notes: [
          {
            title: "JSX is not HTML",
            explanation:
              "JSX is a syntax extension for JavaScript that looks like HTML but compiles to plain JS function calls before running. Each JSX tag becomes a React.createElement() call that produces a plain JavaScript object — a description of what you want. Nothing has been painted yet. JSX is just a shorthand for describing a tree of elements.",
            illustration: {
              type: "code",
              label: "JSX compiles to JavaScript",
              content: `// What you write
const el = (
  <h1 className="title">Hello</h1>
)

// What actually runs
const el = React.createElement(
  'h1',
  { className: 'title' },
  'Hello'
)`,
            },
          },
          {
            title: "Uppercase = React component, lowercase = HTML element",
            explanation:
              "React uses the first character of a JSX tag to decide what to do. Uppercase (PascalCase) = look up the component in JavaScript scope and call it. Lowercase = treat as a native HTML element and pass to the browser's DOM. This is why <div> and <span> are lowercase (they ARE native DOM elements) and your components must be PascalCase. Writing <bento-grid> won't render your React component — it creates an unknown HTML element.",
            illustration: {
              type: "code",
              label: "Case determines what React does with the tag",
              content: `<bento-grid>  →  DOM element (unknown, renders nothing useful)
<BentoGrid>   →  React component (your code runs)

// The rule:
import { BentoGrid } from './bento-grid'  // ← must import
<BentoGrid />                             // ← must be uppercase`,
            },
          },
        ],
      },
      {
        name: "Reactivity",
        notes: [
          {
            title: "UI = f(state) — the core idea of React",
            explanation:
              "React's central insight: your UI is a pure function of your state. You describe what the UI should look like for any given state, and React figures out how to update the DOM. You never manually poke DOM nodes. This is called declarative — you say what the result should be, not how to get there. The old way (jQuery) was imperative: you had to orchestrate every DOM change yourself, in the right order. Missed a step and state would get out of sync.",
            illustration: {
              type: "diagram",
              label: "State change → React re-renders automatically",
              content: `liked = false  ──▶  <button>♡ Like</button>

User clicks → liked = true  (you just update data)

liked = true   ──▶  <button>♥ Liked!</button>

You never touched the DOM.`,
            },
          },
          {
            title: "Declarative vs imperative — designer analogy",
            explanation:
              "Declarative is how you think in Figma's auto-layout: you set a constraint or value and everything that depends on it updates automatically. You don't say 'move this layer 10px left, resize this frame, reflow this text'. Imperative is the old manual way — doing each step yourself. React brought declarative thinking to DOM manipulation.",
          },
        ],
      },
      {
        name: "Virtual DOM",
        notes: [
          {
            title: "Why React doesn't update the whole DOM on every change",
            explanation:
              "Writing to the real DOM is slow — it triggers layout recalculations and repaints. React solves this by keeping its own lightweight copy of the tree in memory (the Virtual DOM). When state changes, React re-runs your component (fast — just JS objects), diffs the old vs new virtual tree to find what changed, then surgically updates only those nodes in the real DOM. You get automatic updates without the performance cost of rebuilding everything.",
            illustration: {
              type: "diagram",
              label: "React's diff-then-patch cycle",
              content: `State changes
     │
     ▼
React re-runs component        ← fast (JS objects)
     │ new Virtual DOM
     ▼
DIFF: old vs new               ← "what changed?"
     │ only changed nodes
     ▼
Update real DOM surgically     ← slow, done minimally`,
            },
          },
        ],
      },
      {
        name: "Rendering",
        notes: [
          {
            title: "Client-side rendering (CSR) vs server-side rendering (SSR)",
            explanation:
              "CSR: the server sends an almost-empty HTML file and a big JS bundle. The browser downloads the JS, React runs in the browser, builds the DOM from scratch. Users see a blank screen until JS loads — can feel slow. SSR: the server runs React first, produces full HTML, sends it already complete. The browser shows content immediately. React then 'hydrates' — attaches event listeners to the existing HTML to make it interactive. Next.js does SSR by default, which is why this portfolio loads fast.",
            illustration: {
              type: "diagram",
              label: "CSR sends an empty shell; SSR sends real content",
              content: `CSR                              SSR
───                              ───
Server sends: <div id="root">    Server runs React first
              <script app.js>    Server sends: full HTML

Browser: blank screen            Browser: content visible
         ↓ downloads JS                   ↓
         React builds DOM        React hydrates (attaches
         ↓                       event listeners)
         Content appears         ↓
                                 Interactive`,
            },
          },
          {
            title: "Hydration",
            explanation:
              "After SSR sends full HTML to the browser, the page looks right but buttons don't work yet — there are no event listeners. Hydration is when React runs in the browser, matches its virtual tree to the existing HTML, and attaches all the interactivity. This is why you sometimes see a brief window where a page is visible but not yet clickable.",
          },
        ],
      },
      {
        name: "Electron",
        notes: [
          {
            title: "Electron = Chromium + Node.js packaged as a desktop app",
            explanation:
              "Electron bundles a full Chromium browser (the engine behind Chrome) with Node.js into a standalone desktop app. Your React code runs inside Chromium exactly as it would in a browser tab — same DOM, same CSS, same rendering. Node.js runs alongside it giving the app powers a website can't have: file system access, OS notifications, menu bar, clipboard, system APIs. Apps like Granola, Figma, VS Code, and Slack are all built on Electron.",
            illustration: {
              type: "diagram",
              label: "Electron's two layers",
              content: `┌─────────────────────────────────────────┐
│             ELECTRON APP               │
│  ┌───────────────────────────────────┐ │
│  │  Chromium (a full browser)        │ │
│  │  React app runs here              │ │
│  │  DOM, CSS — all identical         │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  Node.js                          │ │
│  │  File system, OS APIs, clipboard  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘`,
            },
          },
          {
            title: "Electron apps are always CSR, never SSR",
            explanation:
              "There's no server in an Electron app — it's a desktop app running locally. React always runs in the bundled Chromium renderer process (client-side). SSR only makes sense when there's a server to pre-render HTML before sending it to a browser. In Electron, the 'browser' IS the app window and all rendering happens there.",
          },
        ],
      },
      {
        name: "Components & Props",
        notes: [
          {
            title: "A component is just a function that returns JSX",
            explanation:
              "Three rules: 1) The function name starts with uppercase (Card, not card). 2) It returns JSX — the HTML-like description of what to render. 3) You use it like an HTML tag: <Card />. React calls your function, takes what it returns, and puts those DOM nodes in place. No magic, no special syntax — just a function.",
            illustration: {
              type: "code",
              label: "The simplest possible component",
              content: `function Card() {
  return (
    <div className="rounded-2xl p-6">
      <p>Description</p>
      <h3>Title</h3>
    </div>
  )
}

// Used like this:
<Card />   // React calls Card(), inserts the result`,
            },
          },
          {
            title: "Props are just a JavaScript object",
            explanation:
              "When you write attributes on a component tag, React bundles them all into one object and passes it to your function. <Card title='Hello' description='World' /> becomes Card({ title: 'Hello', description: 'World' }). Inside the function, you use those values in JSX with curly braces: {title}. The curly braces are the switch between JSX mode (markup) and JavaScript mode (variables, expressions).",
            illustration: {
              type: "code",
              label: "What React does with your attributes",
              content: `// You write:
<Card title="Design systems" description="Tokens and rules" />

// React calls:
Card({ title: "Design systems", description: "Tokens and rules" })

// Inside the function:
function Card({ title, description }) {
  return (
    <div>
      <p>{description}</p>   // {} = "evaluate this as JS"
      <h3>{title}</h3>
    </div>
  )
}`,
            },
          },
          {
            title: "Destructuring — pulling values out of an object",
            explanation:
              "Destructuring is a JavaScript shortcut for extracting values from an object into named variables. Instead of props.title and props.description, you pull them out at the function signature using curly braces. The names must match the object's keys exactly. It's the same as declaring const title = props.title — just written inline. This is what you see in every React component's parameter list.",
            illustration: {
              type: "code",
              label: "Three ways to write the same thing",
              content: `// Long way — access via props object
function Card(props) {
  const title = props.title
  const description = props.description
  return <h3>{title}</h3>
}

// Destructure after receiving
function Card(props) {
  const { title, description } = props
  return <h3>{title}</h3>
}

// Destructure inline (what you'll see everywhere)
function Card({ title, description }) {
  return <h3>{title}</h3>
}

// All three are identical. The third is just the shortest.`,
            },
          },
          {
            title: "TypeScript prop types — the contract",
            explanation:
              "The block after the destructured props tells TypeScript what each prop is allowed to be. If you pass the wrong type (a number where a string is expected), TypeScript underlines it red before you run anything. The ? after a prop name makes it optional — you can omit it and nothing breaks. Required props (no ?) must always be provided or TypeScript will warn you.",
            illustration: {
              type: "code",
              label: "Reading a TypeScript prop definition",
              content: `function Card({
  title,
  description,
  className,
}: {
  title: string        // required — must always pass this
  description: string  // required — must always pass this
  className?: string   // optional — ? means you can skip it
}) { ... }

// This works:    <Card title="Hi" description="Hello" />
// This works:    <Card title="Hi" description="Hello" className="p-4" />
// Type error:    <Card title={42} description="Hello" />
//                             ↑ number, not string`,
            },
          },
          {
            title: "The progression: divs → component → props",
            explanation:
              "Stage 1: raw divs, copy-pasted. Change the design = edit every copy. Stage 2: extracted into a component. Change the design = edit one function, all instances update. Stage 3: add props. Now structure lives in one place, content comes from outside. This is the whole point of components — separate the shape from the data.",
            illustration: {
              type: "diagram",
              label: "Same output, increasingly maintainable",
              content: `Stage 1   <div>...</div>        pasted 3×, 3 places to edit
          <div>...</div>
          <div>...</div>

Stage 2   <Card />              defined once, reused 3×
          <Card />              change structure = 1 edit
          <Card />

Stage 3   <Card title="A" />    defined once, reused 3×
          <Card title="B" />    change structure = 1 edit
          <Card title="C" />    change content = change one prop`,
            },
          },
        ],
      },
      {
        name: "CSS Grid",
        notes: [
          {
            title: "How CSS grid works",
            explanation:
              "Add display: grid (or Tailwind's 'grid') to a container and it becomes a grid. Its direct children automatically become grid items placed into the columns you define. grid-template-columns sets how many columns and how wide each is. gap sets the gutter between cells. Children don't need to do anything — the container does all the placing.",
            illustration: {
              type: "code",
              label: "The three classes that make a grid",
              content: `<div className="grid grid-cols-3 gap-4">
  <div>cell 1</div>   // placed in col 1 automatically
  <div>cell 2</div>   // placed in col 2
  <div>cell 3</div>   // placed in col 3
  <div>cell 4</div>   // wraps to next row, col 1
</div>

// grid        →  display: grid
// grid-cols-3 →  grid-template-columns: repeat(3, 1fr)
// gap-4       →  gap: 1rem (between all cells)`,
            },
          },
          {
            title: "1fr — what the fraction unit means",
            explanation:
              "fr means 'fraction of the remaining space'. grid-cols-3 is shorthand for repeat(3, 1fr) — divide the available width into 3 equal fractions. grid-cols-[2fr_1fr] would give the first column twice the space of the second. Unlike px or %, fr units are calculated after gaps are removed, so they always fit perfectly.",
          },
          {
            title: "col-span — making a cell take up multiple columns",
            explanation:
              "By default each grid item fills one cell. Add col-span-2 to a child and it stretches across 2 columns. col-span-3 takes the full width of a 3-column grid. This is how bento layouts work — one grid, items with different spans creating an asymmetric layout. The span is set on the item, not the container.",
            illustration: {
              type: "diagram",
              label: "col-span creates the bento layout",
              content: `<div className="grid grid-cols-3 gap-4">
  <div className="col-span-2">wide card</div>
  <div>narrow</div>
  <div>narrow</div>
  <div className="col-span-2">wide card</div>
</div>

┌──────────────────┬────────┐
│   col-span-2     │ 1 col  │
├────────┬─────────────────-┤
│ 1 col  │   col-span-2     │
└────────┴──────────────────┘`,
            },
          },
        ],
      },
    ],
  },
  {
    category: "PixiJS",
    subcategories: [
      {
        name: "Texture Loading",
        notes: [
          {
            title: "Texture.from() vs Assets.load()",
            explanation:
              "PixiJS v8 has two ways to get a texture. Texture.from(url) is synchronous — it returns immediately, but the texture may not be loaded yet. If you set sprite.width on an unloaded texture, the sprite's internal width is 0, so the scale calculation becomes Infinity or NaN and the sprite is invisible. Assets.load(url) is the correct v8 API: it returns a Promise that resolves when the texture is fully loaded, with real pixel dimensions. It also caches by URL so calling it twice for the same file returns the cached result instantly.",
          },
          {
            title: "Stale async load pattern",
            explanation:
              "When you kick off Assets.load() for a texture, the user might select a different texture before the first one finishes. To guard against this, record the URL in a map immediately when the load starts. In the .then() callback, check if the URL in the map still matches the one you captured at dispatch time — if not, discard the result. Also capture all the values you need (scale, opacity, x, y) as local variables before the async call, because by the time .then() runs, the React state those came from may have updated.",
          },
          {
            title: "Silent 404s in PixiJS",
            explanation:
              "If Assets.load() fails (e.g. the file doesn't exist, 404), it rejects the Promise. Without a .catch(), the failure is swallowed silently — the sprite never appears and there's no error in the console. Always add .catch() to log the failing URL and clean up any loading state so the next render attempt can retry rather than being stuck in a 'loading' limbo.",
          },
        ],
      },
    ],
  },
  {
    category: "JavaScript Fundamentals",
    subcategories: [
      {
        name: "Array Methods",
        notes: [
          {
            title: ".map() — transform every item in a list",
            explanation:
              "map() goes through each item in an array, runs a function on it, and returns a NEW array of the same length. It never changes the original. In React, map() is how you turn a data array into a list of components — same concept, different output type. Think of it like a Figma component with overrides: you have one 'tile' component, and map() creates one instance per project, passing in different data each time.",
            illustration: {
              type: "code",
              label: "JS → React progression",
              content: `// Plain JS: transform strings
const names = ["Granola", "Fin.ai"]
const labels = names.map(name => "🟪 " + name)
// → ["🟪 Granola", "🟪 Fin.ai"]

// React: transform data into components
const tiles = projects.map(project => (
  <Tile key={project.slug} name={project.name} />
))
// → [<Tile name="Granola" />, <Tile name="Fin.ai" />]

// Gallery: 8 projects × 4 images = 32 tiles
const allTiles = projects.flatMap(project =>
  project.images.map(img => (
    <GalleryTile key={img.id} projectId={project.slug} src={img.src} />
  ))
)`,
            },
          },
        ],
      },
      {
        name: "Operators & Syntax",
        notes: [
          {
            title: "=== strict equality (always use this, not ==)",
            explanation:
              "JavaScript has two equality operators. == (loose) tries to convert types before comparing, which produces wild results: 0 == false is true, '' == false is true. === (strict) requires the same type AND the same value — no conversions. Rule: always use ===. Forget == exists. You'll see === constantly in React for comparing state values, checking if a tile belongs to the hovered project, etc.",
            illustration: {
              type: "code",
              label: "== vs ===",
              content: `// == (loose) — dangerous, avoid
0 == false   // → true  ← surprising!
"" == false  // → true  ← surprising!
"5" == 5     // → true  ← type coercion

// === (strict) — predictable, always use
0 === false  // → false ✓
"5" === 5    // → false ✓ (different types)
5 === 5      // → true ✓

// In React: checking which project is active
tile.projectId === hoveredProjectId  // ← strict, safe`,
            },
          },
          {
            title: "Ternary — if/else in one expression",
            explanation:
              "A ternary is a one-line if/else. Three parts: condition ? value-if-true : value-if-false. Read ? as 'then' and : as 'otherwise'. You use this constantly in React because JSX doesn't allow if statements inside curly braces — only expressions. Ternaries let you make decisions inline without breaking out of JSX.",
            illustration: {
              type: "code",
              label: "if/else → ternary",
              content: `// Regular if/else
if (isHovered) {
  return "bright"
} else {
  return "dim"
}

// Ternary — same logic, one line
const opacity = isHovered ? 1 : 0.3
//              condition  ^ then  ^ otherwise

// In JSX — can't use if here, ternary works great
<div className={isHovered ? "tile--bright" : "tile--dim"}>

// Nested (use sparingly — hard to read)
const label = isOpen ? "Close" : isHovered ? "View" : ""`,
            },
          },
          {
            title: "?. optional chaining — the 'don't crash' operator",
            explanation:
              "If you try to access a property on null or undefined, JavaScript crashes with 'Cannot read properties of null'. Optional chaining (?.) says: try to access this, but if the thing doesn't exist, just return undefined instead of crashing. You'll see this everywhere in React because data often starts as null before it loads, or a prop might be optional.",
            illustration: {
              type: "code",
              label: "Crash vs safe",
              content: `const tile = null

tile.projectId    // 💥 TypeError: Cannot read properties of null
tile?.projectId   // → undefined (safe, no crash)

// Chaining through multiple levels
user?.profile?.avatar?.url   // safe at every step

// Common in React with optional props
<div style={{ opacity: tile?.isActive ? 1 : 0.3 }}>

// With arrays
tiles?.[0]?.projectId  // safe even if tiles is undefined`,
            },
          },
        ],
      },
      {
        name: "Functions",
        notes: [
          {
            title: "Arrow functions — just shorter syntax for a function",
            explanation:
              "An arrow function is the same as a regular function, just written differently. Both take inputs, do something, and return a result. Arrow functions are preferred in React because they're shorter — especially useful inside .map() and event handlers where you're writing many small throwaway functions. The shorthand version drops the curly braces and return keyword when the function just returns one thing.",
            illustration: {
              type: "code",
              label: "Three ways to write the same function",
              content: `// Named function (old style)
function double(n) { return n * 2 }

// Arrow function (same thing)
const double = (n) => { return n * 2 }

// Arrow shorthand — drop {} and return when returning one thing
const double = (n) => n * 2

// All three: double(5) → 10`,
            },
          },
          {
            title: "Anonymous functions — functions with no name",
            explanation:
              "Most functions in React are anonymous — they have no name because they're used once, inline, and never called from anywhere else. You only name a function when you need to reuse it in multiple places. Anonymous functions appear constantly inside event handlers and .map() calls.",
            illustration: {
              type: "code",
              label: "Named vs anonymous",
              content: `// Named — reusable
const handleLeave = () => setHoveredId(null)
<div onMouseLeave={handleLeave}>   // reused
<div onMouseLeave={handleLeave}>   // reused again

// Anonymous — one-time, inline
<div onMouseLeave={() => setHoveredId(null)}>`,
            },
          },
          {
            title: "The function wrapper — why () => is needed in event handlers",
            explanation:
              "In JavaScript, the right side of an assignment is always evaluated immediately — before the left side label matters. So onMouseEnter={setHoveredId('granola')} runs setHoveredId right now, on page load, not on hover. The () => wrapper creates a function to call LATER. Without it, you're passing the result of the function (undefined). With it, you're passing the function itself — React calls it when the event fires.",
            illustration: {
              type: "code",
              label: "Immediate vs deferred",
              content: `// ❌ Runs immediately on page load
onMouseEnter={setHoveredId("granola")}
// JavaScript evaluates right side first:
// setHoveredId("granola") → runs NOW → returns undefined
// onMouseEnter = undefined → nothing happens on hover

// ✓ Runs when mouse enters
onMouseEnter={() => setHoveredId("granola")}
// Right side creates a function, doesn't call it
// onMouseEnter = [function, waiting]
// React calls it later when mouse enters

// Pizza analogy:
orderPizza()           // calls NOW
() => orderPizza()     // hands you a button — calls when pressed`,
            },
          },
          {
            title: "Reading vs evaluation — why the label doesn't protect you",
            explanation:
              "Reading means going through code in order, left to right. Evaluation means actually running a piece of code to get its value. When JavaScript hits an = sign, it evaluates the right side first to get a value, then assigns it to the left. The left side label (like onMouseEnter) doesn't delay evaluation of the right side — it just says where the result goes. Think of a recipe: you read 'put the cake in the box' left to right, but you have to make the cake before you can put it anywhere.",
            illustration: {
              type: "code",
              label: "What JavaScript actually does",
              content: `onMouseEnter = setHoveredId("granola")

// What JS does, step by step:
// 1. See the = sign
// 2. Evaluate RIGHT side first: setHoveredId("granola") → RUNS NOW
// 3. Get the result: undefined
// 4. Assign to LEFT side: onMouseEnter = undefined

// The label onMouseEnter doesn't matter until step 4.
// By then, setHoveredId has already fired.`,
            },
          },
        ],
      },
      {
        name: "React Core",
        notes: [
          {
            title: "Component, Props, State — the three core ideas",
            explanation:
              "Everything in React is built from three concepts. A Component is a function that returns JSX — it's like a Figma component, a reusable piece of UI. Props are its inputs — read-only data passed in from the parent, like Figma instance overrides. State is internal memory that belongs to the component — when state changes, React redraws that component automatically. The key insight: you never manually update the DOM. You update state, and React figures out what changed.",
            illustration: {
              type: "code",
              label: "All three in one component",
              content: `// Component = a function that returns JSX
function GalleryTile(props) {       // ← props are the inputs

  // State = internal memory
  const [isHovered, setIsHovered] = useState(false)
  //     ^ current value  ^ function to update it

  // When state changes, this whole function re-runs
  // and React updates only what changed on screen
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ opacity: isHovered ? 1 : 0.4 }}
    >
      <img src={props.src} />
    </div>
  )
}

// Parent passes props (like Figma overrides)
<GalleryTile src="/imgs/granola-1.jpg" projectId="granola" />`,
            },
          },
        ],
      },
    ],
  },
  {
    category: "Git",
    subcategories: [
      {
        name: "Worktrees",
        notes: [
          {
            title: "git worktrees",
            explanation:
              "A worktree lets you check out multiple branches simultaneously in separate folders — without stashing or switching. Normally one working directory = one branch. A worktree creates a second folder tied to a different branch, sharing the same .git history. File changes are fully isolated between them. Useful for: testing a feature without touching your current work, running two versions side-by-side in the browser, or reviewing someone else's branch without disturbing yours.",
          },
        ],
      },
    ],
  },
];

export function flattenNotes(notes: LearningCategory[]): FlatCard[] {
  return notes.flatMap((cat) =>
    cat.subcategories.flatMap((sub) =>
      sub.notes.map((note) => ({
        category: cat.category,
        subcategory: sub.name,
        title: note.title,
        explanation: note.explanation,
        illustration: note.illustration,
      }))
    )
  );
}

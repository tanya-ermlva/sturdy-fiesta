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
    ],
  },
  {
    category: "Architecture",
    subcategories: [
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
    category: "Tools",
    subcategories: [
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
    ],
  },
];

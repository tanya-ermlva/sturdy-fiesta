# Frontend Structure & CSS/Tailwind Guide

## 📁 File Structure Overview

```
Portfolio/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── ProjectList.tsx # Container for all projects
│   │   └── ProjectItem.tsx # Individual project item
│   ├── data/
│   │   └── projects.ts     # Project data (names, slugs)
│   ├── globals.css         # Global styles & font declarations
│   ├── layout.tsx          # Root layout (wraps all pages)
│   └── page.tsx            # Homepage (main page)
├── public/
│   └── fonts/              # Custom font files
└── tailwind.config.ts      # Tailwind configuration
```

---

## 🏗️ How Next.js App Router Works

### The Component Hierarchy

```
layout.tsx (Root)
  └── page.tsx (Homepage)
       └── ProjectList component
            └── ProjectItem components (8 of them)
```

**Flow:**
1. `layout.tsx` wraps everything - it's like the outer shell
2. `page.tsx` is what users see when they visit `/`
3. `page.tsx` imports and uses `ProjectList`
4. `ProjectList` creates multiple `ProjectItem` components

---

## 🎨 Tailwind CSS - Complete Breakdown

Tailwind is a **utility-first CSS framework**. Instead of writing custom CSS, you use pre-built classes.

### How Tailwind Works

**Traditional CSS:**
```css
.my-button {
  background-color: blue;
  padding: 10px;
  border-radius: 5px;
}
```

**Tailwind (what we use):**
```html
<button className="bg-blue-500 px-4 py-2 rounded-lg">
```

The class names ARE the styles!

---

## 📐 CSS Positioning - The Foundation

### 1. **Static** (Default)
- Elements flow in document order
- No special positioning
- Most elements are static by default

### 2. **Relative**
```css
position: relative;
```
- Element stays in normal flow
- You can offset it with `top`, `left`, `right`, `bottom`
- Creates a positioning context for absolute children

**In our code:**
```tsx
<li className="relative ...">
```
We use `relative` so the arrow can be positioned relative to the list item.

### 3. **Absolute**
```css
position: absolute;
```
- Removed from normal flow
- Positioned relative to nearest positioned ancestor (relative/absolute/fixed)
- If no positioned ancestor, positioned relative to `<body>`

**Example:**
```tsx
<div className="relative">  {/* Positioning context */}
  <div className="absolute top-0 right-0">  {/* Positioned relative to parent */}
    Arrow
  </div>
</div>
```

### 4. **Fixed**
```css
position: fixed;
```
- Positioned relative to viewport (screen)
- Stays in same place when scrolling
- Used for headers, modals, etc.

### 5. **Sticky**
```css
position: sticky;
```
- Acts like relative until you scroll past it
- Then "sticks" to a position
- Great for sticky headers

---

## 🎯 Breaking Down Our Code

### **page.tsx - The Main Layout**

```tsx
<main className="min-h-screen bg-white text-black">
```

**Breaking it down:**
- `min-h-screen` = minimum height of 100vh (full viewport height)
- `bg-white` = background color white
- `text-black` = text color black

```tsx
<div className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-16 lg:px-24">
```

**Breaking it down:**
- `max-w-[1600px]` = maximum width of 1600px (custom value in brackets)
- `mx-auto` = margin left and right auto (centers the div)
- `px-6` = padding left/right of 1.5rem (24px)
- `sm:px-8` = on small screens and up, padding becomes 2rem (32px)
- `md:px-16` = on medium screens, padding becomes 4rem (64px)
- `lg:px-24` = on large screens, padding becomes 6rem (96px)

**This is responsive design!** The padding changes based on screen size.

---

### **The Grid System**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 xl:gap-x-24 gap-y-12 md:gap-y-16">
```

**Breaking it down:**

1. **`grid`** = Makes this a CSS Grid container
   - Grid is a 2D layout system (rows AND columns)
   - Flexbox is 1D (rows OR columns)

2. **`grid-cols-1`** = 1 column on mobile
   - On small screens, everything stacks vertically

3. **`md:grid-cols-2`** = 2 columns on medium screens and up
   - On tablets/desktops, we get 2 columns

4. **`gap-x-8`** = Horizontal gap of 2rem (32px) between columns

5. **`lg:gap-x-16`** = On large screens, gap becomes 4rem (64px)

6. **`xl:gap-x-24`** = On extra large screens, gap becomes 6rem (96px)

7. **`gap-y-12`** = Vertical gap of 3rem (48px) between rows

8. **`md:gap-y-16`** = On medium screens, vertical gap becomes 4rem (64px)

**Visual representation:**
```
Mobile (1 column):        Desktop (2 columns):
┌─────────────┐          ┌─────────┬─────────┐
│   Name      │          │  Name   │  Desc   │
│   Title     │          │  Title  │         │
│             │          ├─────────┴─────────┤
│   Desc      │          │   (empty space)   │
│             │          ├─────────┬─────────┤
│   Projects  │          │ Projects│ Contact │
│             │          └─────────┴─────────┘
│   Contact   │
└─────────────┘
```

---

### **Spacing Classes**

```tsx
<div className="space-y-1">
```

**Breaking it down:**
- `space-y-1` = Adds vertical spacing between children
- `space-y-1` = 0.25rem (4px) gap between each child element
- Only applies to direct children

**Other spacing options:**
- `space-y-0` = No spacing
- `space-y-2` = 0.5rem (8px)
- `space-y-4` = 1rem (16px)
- `space-y-8` = 2rem (32px)

**Horizontal spacing:**
- `space-x-1` = Horizontal spacing between children

---

### **Typography Classes**

```tsx
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.2] tracking-tight">
```

**Breaking it down:**

1. **`text-xl`** = Base font size: 1.25rem (20px)
2. **`sm:text-2xl`** = On small screens: 1.5rem (24px)
3. **`md:text-3xl`** = On medium screens: 1.875rem (30px)
4. **`lg:text-4xl`** = On large screens: 2.25rem (36px)

**Responsive typography!** Text gets bigger on larger screens.

5. **`font-medium`** = Font weight 500 (medium boldness)

6. **`leading-[1.2]`** = Line height 1.2 (custom value in brackets)
   - Line height controls space between lines
   - 1.2 means 20% extra space above/below text

7. **`tracking-tight`** = Letter spacing: -0.025em
   - Negative letter spacing = letters closer together
   - Swiss typography style!

---

### **Flexbox Classes**

```tsx
<span className="inline-flex items-center gap-2">
```

**Breaking it down:**

1. **`inline-flex`** = Makes element an inline flex container
   - `inline-flex` = behaves like inline element, but children use flexbox
   - `flex` = behaves like block element, children use flexbox

2. **`items-center`** = Aligns items vertically in center
   - `items-start` = top
   - `items-center` = middle
   - `items-end` = bottom

3. **`gap-2`** = Gap of 0.5rem (8px) between flex children
   - Only works in flexbox/grid containers

**Visual:**
```
┌─────────────────┐
│  Text  →        │  ← Arrow aligned center, gap between
└─────────────────┘
```

---

## 🔄 How the Hover Interaction Works

### Step-by-Step Flow

1. **User moves mouse** over the project list
2. **`onMouseMove` event fires** on the `<ul>` element
3. **`handleMouseMove` function runs:**
   ```tsx
   const handleMouseMove = (e: React.MouseEvent) => {
     setMousePosition({ x: e.clientX, y: e.clientY });
     calculateDistances(e.clientX, e.clientY);
   };
   ```
   - `e.clientX` = mouse X position relative to viewport
   - `e.clientY` = mouse Y position relative to viewport

4. **`calculateDistances` function:**
   ```tsx
   items.forEach((item, index) => {
     const rect = item.getBoundingClientRect();
     const centerX = rect.left + rect.width / 2;
     const centerY = rect.top + rect.height / 2;
     const distance = Math.sqrt(
       Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
     );
   });
   ```
   
   **What's happening:**
   - `getBoundingClientRect()` = Gets element's position and size
   - Calculates center point of each project item
   - Uses Pythagorean theorem to find distance from mouse to center
   - Stores all distances in an array

5. **Sort distances:**
   ```tsx
   distances.sort((a, b) => a.distance - b.distance);
   ```
   - Closest project = index 0
   - Second closest = index 1
   - etc.

6. **Apply scales:**
   ```tsx
   newScales[distances[0].index] = 1.2;  // Closest: 120% size
   newScales[distances[1].index] = 1.1;  // Second: 110% size
   newScales[distances[2].index] = 1.05; // Third: 105% size
   ```

7. **Update state:**
   ```tsx
   setProjectScales(newScales);
   setHoveredIndex(newHoveredIndex);
   ```
   - React re-renders components with new scale values

8. **CSS Transform applies:**
   ```tsx
   <li style={{ transform: `scale(${scale})` }}>
   ```
   - `scale(1.2)` = makes element 120% of original size
   - `origin-left` = scales from left side (text stays aligned)

---

## 🎭 CSS Transform Explained

### Transform Property

```tsx
style={{ transform: `scale(${scale})` }}
```

**Transform functions:**
- `scale(1.2)` = 120% size
- `scale(0.5)` = 50% size
- `translateX(10px)` = move 10px right
- `translateY(10px)` = move 10px down
- `rotate(45deg)` = rotate 45 degrees

**Transform Origin:**
```tsx
className="origin-left"
```
- `origin-left` = scaling happens from left edge
- `origin-center` = scaling from center (default)
- `origin-right` = scaling from right edge

**Why `origin-left`?**
- Keeps text aligned to the left
- Text doesn't shift when scaling

---

## ⚡ CSS Transitions

```tsx
className="transition-transform duration-300 ease-out"
```

**Breaking it down:**

1. **`transition-transform`** = Only animate the `transform` property
   - Other properties (like color) won't animate

2. **`duration-300`** = Animation takes 300ms (0.3 seconds)
   - `duration-150` = 150ms (faster)
   - `duration-500` = 500ms (slower)

3. **`ease-out`** = Easing function
   - `ease-out` = starts fast, ends slow
   - `ease-in` = starts slow, ends fast
   - `ease-in-out` = slow start and end, fast middle
   - `linear` = constant speed

**What this does:**
When the scale changes, it smoothly animates over 300ms instead of instantly jumping.

---

## 📱 Responsive Design Breakpoints

Tailwind's default breakpoints:

```
sm:  640px   (small tablets)
md:  768px   (tablets)
lg:  1024px  (small laptops)
xl:  1280px  (desktops)
2xl: 1536px  (large desktops)
```

**How it works:**
```tsx
className="text-sm md:text-lg lg:text-xl"
```

- **Mobile (< 768px):** `text-sm` applies
- **Tablet (≥ 768px):** `md:text-lg` applies
- **Desktop (≥ 1024px):** `lg:text-xl` applies

**Mobile-first approach:**
- Base classes = mobile styles
- Prefix classes = larger screen overrides

---

## 🎨 Color System

```tsx
className="bg-white text-black"
```

**Tailwind colors:**
- `bg-white` = background white
- `bg-black` = background black
- `text-white` = text white
- `text-black` = text black

**Custom colors (from tailwind.config.ts):**
```tsx
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
}
```

These use CSS variables defined in `globals.css`.

---

## 🔤 Typography System

### Line Height

```css
line-height: 1.2;
```

**What it means:**
- `1.2` = 120% of font size
- If font is 20px, line height is 24px
- `1.0` = no extra space (tight)
- `1.5` = 50% extra space (loose)

**In our code:**
```tsx
leading-[1.2]  // Custom value: 1.2
leading-tight  // Pre-built: ~1.25
leading-normal // Pre-built: 1.5
leading-loose  // Pre-built: 2.0
```

### Letter Spacing

```css
letter-spacing: -0.01em;
```

**What it means:**
- Negative = letters closer together (tight)
- Positive = letters further apart (loose)
- `em` = relative to font size

**In our code:**
```tsx
tracking-tight   // -0.025em
tracking-normal  // 0em
tracking-wide    // 0.025em
```

---

## 🧩 Component Breakdown

### ProjectList Component

**What it does:**
- Manages hover state for all projects
- Calculates distances from mouse to each project
- Determines which projects should scale
- Passes scale values to each ProjectItem

**Key React concepts:**

1. **State:**
   ```tsx
   const [projectScales, setProjectScales] = useState([1, 1, 1, ...]);
   ```
   - Stores current scale for each project
   - When state changes, React re-renders

2. **Ref:**
   ```tsx
   const listRef = useRef<HTMLUListElement>(null);
   ```
   - Direct reference to DOM element
   - Used to get element positions

3. **useCallback:**
   ```tsx
   const calculateDistances = useCallback((mouseX, mouseY) => {
     // ...
   }, []);
   ```
   - Memoizes function (doesn't recreate on every render)
   - Performance optimization

### ProjectItem Component

**What it does:**
- Renders individual project name
- Applies scale transform
- Shows/hides arrow based on hover state

**Props (data passed from parent):**
```tsx
<ProjectItem
  name="Granola"        // Project name
  scale={1.2}          // Current scale value
  showArrow={true}     // Should arrow be visible?
  onMouseMove={...}    // Mouse move handler
/>
```

---

## 🎯 Key CSS Concepts Used

### 1. **Box Model**
Every element is a box with:
- Content (text/image)
- Padding (space inside)
- Border (edge)
- Margin (space outside)

**Tailwind equivalents:**
- `p-4` = padding all sides
- `px-4` = padding left/right
- `py-4` = padding top/bottom
- `m-4` = margin all sides
- `mx-auto` = margin left/right auto (centers)

### 2. **Display Types**

- **Block:** Takes full width, stacks vertically
- **Inline:** Only takes needed width, flows horizontally
- **Inline-block:** Mix of both
- **Flex:** Children use flexbox layout
- **Grid:** Children use grid layout

**Tailwind:**
- `block`, `inline`, `inline-block`, `flex`, `inline-flex`, `grid`

### 3. **Z-Index**

Controls stacking order (what's on top):
```tsx
className="z-10"  // Higher number = on top
```

### 4. **Overflow**

What happens when content is too big:
- `overflow-hidden` = hide overflow
- `overflow-scroll` = add scrollbar
- `overflow-auto` = scrollbar if needed

---

## 🚀 Performance Tips

### Why use `useCallback`?

```tsx
const handleMouseMove = useCallback((e) => {
  // ...
}, [calculateDistances]);
```

- Prevents function from being recreated on every render
- Only recreates if dependencies change
- Better performance for frequent events (like mouse move)

### Why use `useRef`?

```tsx
const listRef = useRef<HTMLUListElement>(null);
```

- Direct DOM access without re-renders
- `getBoundingClientRect()` needs actual DOM element
- State would cause unnecessary re-renders

---

## 📚 Common Tailwind Patterns

### Spacing Scale

Tailwind uses a consistent spacing scale:
```
0 = 0px
1 = 0.25rem (4px)
2 = 0.5rem (8px)
4 = 1rem (16px)
8 = 2rem (32px)
16 = 4rem (64px)
```

### Responsive Pattern

```tsx
className="base-class sm:small md:medium lg:large"
```

Always mobile-first!

### Custom Values

```tsx
className="max-w-[1600px]"  // Custom value in brackets
leading-[1.2]                // Custom line height
```

Use brackets `[]` for values not in Tailwind's scale.

---

## 🎓 Summary

**Key Takeaways:**

1. **Tailwind = Utility Classes** - Classes are the styles
2. **Mobile-First** - Base styles for mobile, prefix for larger screens
3. **Grid = 2D Layout** - Perfect for Swiss typography grid
4. **Transform = Animations** - Scale, translate, rotate
5. **State = React Updates** - Changing state triggers re-renders
6. **Positioning** - Relative creates context, absolute positions within it
7. **Transitions** - Smooth animations between states

**File Flow:**
```
layout.tsx → page.tsx → ProjectList → ProjectItem (×8)
```

**Data Flow:**
```
Mouse Move → Calculate Distances → Update State → Re-render → CSS Transform
```

---

## 🔍 Debugging Tips

### Check Element Positions

```javascript
const rect = element.getBoundingClientRect();
console.log(rect); // Shows x, y, width, height
```

### Check Tailwind Classes

Use browser DevTools to see computed styles.

### Common Issues

1. **Spacing not working?** Check if parent is flex/grid
2. **Transform not animating?** Check for `transition-transform`
3. **Responsive not working?** Check breakpoint values
4. **Positioning wrong?** Check parent has `relative`

---

This is a complete breakdown of the frontend structure! Every class and concept is explained. Feel free to ask about any specific part you want to dive deeper into.

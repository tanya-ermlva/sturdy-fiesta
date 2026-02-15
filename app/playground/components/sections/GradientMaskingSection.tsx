'use client';

import { useState, useMemo } from 'react';
import SectionWrapper from '../SectionWrapper';
import CssCodeBlock from '../CssCodeBlock';
import SliderControl from '../SliderControl';
import SelectControl from '../SelectControl';

// ---------------------------------------------------------------------------
// Shared mask preview — renders content + mask with checkerboard behind
// ---------------------------------------------------------------------------
function MaskPreview({
  contentStyle,
  maskStyle,
  label,
  className = '',
}: {
  contentStyle: React.CSSProperties;
  maskStyle: React.CSSProperties;
  label?: string;
  className?: string;
}) {
  const checkerboard =
    'repeating-conic-gradient(#d0d0d0 0% 25%, #f0f0f0 0% 50%) 0 0 / 16px 16px';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-mono text-foreground-subtle">{label}</span>
      )}
      <div
        className="relative overflow-hidden rounded-xl border border-border-muted aspect-video"
        style={{ background: checkerboard }}
      >
        <div className="absolute inset-0" style={{ ...contentStyle, ...maskStyle }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 1 — Direct mask: mask the content itself
// ---------------------------------------------------------------------------
function DirectMaskExample() {
  const [fadeStart, setFadeStart] = useState(30);
  const [fadeEnd, setFadeEnd] = useState(70);

  const maskValue = `radial-gradient(ellipse at center, black ${fadeStart}%, transparent ${fadeEnd}%)`;

  const contentStyle: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    backgroundColor: '#fafafa',
  };

  const maskStyle: React.CSSProperties = {
    maskImage: maskValue,
    WebkitMaskImage: maskValue,
  };

  const code = `/* The mask is applied directly to the grid */
.grid-pattern {
  background-image:
    linear-gradient(to right, #e4e4e7 1px, transparent 1px),
    linear-gradient(to bottom, #e4e4e7 1px, transparent 1px);
  background-size: 40px 40px;

  mask-image: radial-gradient(
    ellipse at center,
    black ${fadeStart}%,       /* visible center */
    transparent ${fadeEnd}%    /* fades to invisible */
  );
}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base text-foreground-strong">
        Approach A: Mask the content directly
      </h3>
      <p className="text-sm text-foreground-muted leading-relaxed max-w-2xl">
        The most intuitive approach. Apply <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">mask-image</code> to
        the element you want to fade. Black in the gradient = visible, transparent = hidden.
        The center stays visible and the edges vanish.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          <MaskPreview
            contentStyle={contentStyle}
            maskStyle={maskStyle}
            label="Grid masked directly — center visible, edges fade"
          />
          <CssCodeBlock code={code} />
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border-muted bg-surface-muted p-4">
          <SliderControl
            label="Visible until"
            value={fadeStart}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeStart}
            hint="Content is fully visible from center to here."
          />
          <SliderControl
            label="Fully hidden at"
            value={fadeEnd}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeEnd}
            hint="Content is completely gone by this point."
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 2 — Overlay mask: mask a solid overlay ON TOP (the Grid.tsx trick)
// ---------------------------------------------------------------------------
function OverlayMaskExample() {
  const [fadeStart, setFadeStart] = useState(10);
  const [fadeEnd, setFadeEnd] = useState(50);
  const [overlayColor, setOverlayColor] = useState('#F5F3F0');

  const maskValue = `radial-gradient(ellipse at center, transparent ${fadeStart}%, black ${fadeEnd}%)`;

  const code = `/* Layer 1: the grid pattern (NO mask) */
.grid-layer {
  background-image:
    linear-gradient(to right, #e4e4e7 1px, transparent 1px),
    linear-gradient(to bottom, #e4e4e7 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Layer 2: solid overlay WITH an INVERTED mask */
.overlay {
  background: ${overlayColor};
  mask-image: radial-gradient(
    ellipse at center,
    transparent ${fadeStart}%,  /* overlay invisible = grid shows */
    black ${fadeEnd}%           /* overlay visible = grid hidden */
  );
}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base text-foreground-strong">
        Approach B: Mask a solid overlay (the Grid.tsx trick)
      </h3>
      <p className="text-sm text-foreground-muted leading-relaxed max-w-2xl">
        This is what my portfolio actually does — and it's inverted! Instead of masking the grid,
        a <strong>solid-color overlay</strong> sits on top with a mask that makes its center
        transparent (so the grid shows through) and its edges opaque (covering the grid). The
        visual result is similar, but the overlay approach lets the background color bleed
        naturally into surrounding content.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          {/* Composite preview: grid underneath, masked overlay on top */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-foreground-subtle">
              Solid overlay on top of grid — center transparent, edges opaque
            </span>
            <div className="relative overflow-hidden rounded-xl border border-border-muted aspect-video">
              {/* Grid layer */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  backgroundColor: '#fafafa',
                }}
              />
              {/* Masked solid overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: overlayColor,
                  maskImage: maskValue,
                  WebkitMaskImage: maskValue,
                }}
              />
            </div>
          </div>
          <CssCodeBlock code={code} />
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border-muted bg-surface-muted p-4">
          <SliderControl
            label="Transparent until"
            value={fadeStart}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeStart}
            hint="Overlay is invisible here — grid shows through."
          />
          <SliderControl
            label="Fully opaque at"
            value={fadeEnd}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeEnd}
            hint="Overlay fully covers the grid from here outward."
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-foreground-muted">Overlay color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={overlayColor}
                onChange={(e) => setOverlayColor(e.target.value)}
                className="h-8 w-8 shrink-0 cursor-pointer rounded border border-border-muted bg-transparent"
              />
              <span className="text-xs font-mono text-foreground-subtle">{overlayColor}</span>
            </div>
          </div>

          <div className="rounded-lg bg-accent-subtle p-3">
            <p className="text-xs text-foreground-muted">
              <strong className="text-accent-strong">Try this!</strong> Notice the mask values
              are swapped compared to Approach A — <code className="text-xs font-mono">transparent</code> comes
              first, then <code className="text-xs font-mono">black</code>. Same gradient tool, opposite visual effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 3 — Linear mask on an image (fade-out effect)
// ---------------------------------------------------------------------------
function ImageMaskExample() {
  const [direction, setDirection] = useState('to bottom');
  const [fadeStart, setFadeStart] = useState(50);
  const [fadeEnd, setFadeEnd] = useState(100);

  const directionOptions = [
    { label: 'to bottom', value: 'to bottom' },
    { label: 'to top', value: 'to top' },
    { label: 'to right', value: 'to right' },
    { label: 'to left', value: 'to left' },
  ];

  const maskValue = `linear-gradient(${direction}, black ${fadeStart}%, transparent ${fadeEnd}%)`;

  const contentStyle: React.CSSProperties = {
    backgroundImage: 'url(https://picsum.photos/seed/gradient-playground/800/450)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const maskStyle: React.CSSProperties = {
    maskImage: maskValue,
    WebkitMaskImage: maskValue,
  };

  const code = `img {
  mask-image: linear-gradient(
    ${direction},
    black ${fadeStart}%,       /* fully visible */
    transparent ${fadeEnd}%    /* fully hidden */
  );
  -webkit-mask-image: linear-gradient(
    ${direction},
    black ${fadeStart}%,
    transparent ${fadeEnd}%
  );
}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base text-foreground-strong">
        Example: Linear mask on an image
      </h3>
      <p className="text-sm text-foreground-muted leading-relaxed max-w-2xl">
        A linear gradient mask is the classic way to fade an image into the page background.
        The image is fully visible where the mask is black, and fully transparent where the mask
        is transparent. This is exactly what the{' '}
        <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">.fade-bottom</code> utility
        class in our CSS does.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          <MaskPreview
            contentStyle={contentStyle}
            maskStyle={maskStyle}
            label="Photo fading out with a linear mask"
          />
          <CssCodeBlock code={code} />
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border-muted bg-surface-muted p-4">
          <SelectControl
            label="Direction"
            value={direction}
            options={directionOptions}
            onChange={setDirection}
          />
          <SliderControl
            label="Visible until"
            value={fadeStart}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeStart}
          />
          <SliderControl
            label="Fully hidden at"
            value={fadeEnd}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeEnd}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 4 — Radial mask on an image (spotlight / vignette)
// ---------------------------------------------------------------------------
function ImageVignetteMaskExample() {
  const [fadeStart, setFadeStart] = useState(40);
  const [fadeEnd, setFadeEnd] = useState(70);
  const [centerX, setCenterX] = useState(50);
  const [centerY, setCenterY] = useState(50);

  const maskValue = `radial-gradient(ellipse at ${centerX}% ${centerY}%, black ${fadeStart}%, transparent ${fadeEnd}%)`;

  const contentStyle: React.CSSProperties = {
    backgroundImage: 'url(https://picsum.photos/seed/gradient-vignette/800/450)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const maskStyle: React.CSSProperties = {
    maskImage: maskValue,
    WebkitMaskImage: maskValue,
  };

  const code = `img {
  mask-image: radial-gradient(
    ellipse at ${centerX}% ${centerY}%,
    black ${fadeStart}%,       /* fully visible */
    transparent ${fadeEnd}%    /* fully hidden */
  );
}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base text-foreground-strong">
        Example: Radial mask on an image (spotlight)
      </h3>
      <p className="text-sm text-foreground-muted leading-relaxed max-w-2xl">
        A radial mask creates a spotlight or vignette effect — the center of the image stays
        visible and the edges dissolve. Move the center point to create off-center reveals.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          <MaskPreview
            contentStyle={contentStyle}
            maskStyle={maskStyle}
            label="Photo with radial spotlight mask"
          />
          <CssCodeBlock code={code} />
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border-muted bg-surface-muted p-4">
          <SliderControl
            label="Center X"
            value={centerX}
            min={0}
            max={100}
            unit="%"
            onChange={setCenterX}
          />
          <SliderControl
            label="Center Y"
            value={centerY}
            min={0}
            max={100}
            unit="%"
            onChange={setCenterY}
          />
          <SliderControl
            label="Visible until"
            value={fadeStart}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeStart}
          />
          <SliderControl
            label="Fully hidden at"
            value={fadeEnd}
            min={0}
            max={100}
            unit="%"
            onChange={setFadeEnd}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 5 — Multiple masks
// ---------------------------------------------------------------------------
function MultipleMaskExample() {
  const maskValue =
    'radial-gradient(ellipse at 30% 50%, black 20%, transparent 50%), radial-gradient(ellipse at 70% 50%, black 20%, transparent 50%)';

  const contentStyle: React.CSSProperties = {
    backgroundImage: 'url(https://picsum.photos/seed/gradient-multi/800/450)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const maskStyle: React.CSSProperties = {
    maskImage: maskValue,
    WebkitMaskImage: maskValue,
    maskComposite: 'add',
    WebkitMaskComposite: 'source-over',
  };

  const code = `img {
  mask-image:
    radial-gradient(ellipse at 30% 50%, black 20%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, black 20%, transparent 50%);
  mask-composite: add;
  -webkit-mask-composite: source-over;
}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base text-foreground-strong">
        Example: Multiple masks combined
      </h3>
      <p className="text-sm text-foreground-muted leading-relaxed max-w-2xl">
        Just like <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">background-image</code>,
        you can layer multiple masks with commas. The{' '}
        <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">mask-composite</code> property
        controls how they combine — <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">add</code> merges
        their visible areas together.
      </p>

      <div className="flex flex-col gap-4 max-w-2xl">
        <MaskPreview
          contentStyle={contentStyle}
          maskStyle={maskStyle}
          label="Two spotlight masks combined with mask-composite: add"
        />
        <CssCodeBlock code={code} />
      </div>
    </div>
  );
}

// ===========================================================================
// Main section
// ===========================================================================
export default function GradientMaskingSection() {
  return (
    <SectionWrapper
      id="masking"
      number={6}
      title="Gradient Masking"
      description="The final boss: mask-image. Instead of COLORING pixels, gradients control which pixels are VISIBLE. This is exactly how my portfolio's grid fades into the background — but the trick is more subtle than you'd think."
    >
      {/* Explainer block */}
      <div className="mb-10 max-w-2xl flex flex-col gap-6">
        <div>
          <h3 className="text-base text-foreground-strong mb-2">How mask-image works (per MDN)</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            The <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">mask-image</code> property
            takes any CSS image — gradients included — and uses it as a visibility map for the element.
            The default <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">mask-mode</code> is{' '}
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">match-source</code>, which
            for gradients resolves to <strong>alpha mode</strong>:
          </p>
          <ul className="mt-3 text-sm text-foreground-muted leading-relaxed flex flex-col gap-1.5 list-disc pl-5">
            <li>
              <strong className="text-foreground-default">Opaque areas</strong> (any solid color — black, red, white, doesn't matter)
              → element is <strong>visible</strong>
            </li>
            <li>
              <strong className="text-foreground-default">Transparent areas</strong>{' '}
              → element is <strong>hidden</strong>
            </li>
            <li>
              <strong className="text-foreground-default">Semi-transparent areas</strong>{' '}
              → element is <strong>partially visible</strong> (proportional to alpha)
            </li>
          </ul>
          <p className="mt-3 text-sm text-foreground-muted leading-relaxed">
            This means <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">black</code> and{' '}
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">white</code> do the{' '}
            <em>same thing</em> in alpha mode — both are fully opaque. What matters is the{' '}
            <strong>alpha channel</strong>, not the color. The common convention of using{' '}
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">black</code> is just readability — it
            could be <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">red</code> and
            it would work identically.
          </p>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">Two ways to fade edges</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            There are two approaches, and they look similar but work in opposite directions:
          </p>
          <ul className="mt-3 text-sm text-foreground-muted leading-relaxed flex flex-col gap-3">
            <li>
              <strong className="text-foreground-default">A) Mask the content directly</strong> —
              Apply <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">mask-image</code> to
              the content itself. The gradient goes from <code className="text-xs font-mono">black</code> (visible) to{' '}
              <code className="text-xs font-mono">transparent</code> (hidden). The content fades out at the edges.
            </li>
            <li>
              <strong className="text-foreground-default">B) Mask a solid overlay</strong> —
              Layer a solid-color div on top and mask <em>that</em>. The gradient goes from{' '}
              <code className="text-xs font-mono">transparent</code> (overlay invisible = content shows) to{' '}
              <code className="text-xs font-mono">black</code> (overlay visible = content hidden).{' '}
              <strong>This is what my Grid.tsx does.</strong>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">Why my portfolio uses the overlay approach</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            The overlay is a <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">bg-background</code> div
            that matches the page color. As the mask makes the overlay opaque toward the edges,
            the grid pattern seamlessly dissolves into the page background — no hard boundaries,
            no color mismatch. The overlay "becomes" the page.
          </p>
          <pre className="mt-3 rounded-lg border border-border-muted bg-surface-default p-4 text-xs font-mono text-foreground-muted overflow-x-auto leading-relaxed">{`<!-- Grid.tsx — the two layers -->

<!-- Layer 1: grid lines, no mask -->
<div class="[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),
  linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]
  [background-size:40px_40px]" />

<!-- Layer 2: solid bg-background overlay with INVERTED mask -->
<div class="bg-background
  [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_50%)]" />
  <!--           center: overlay invisible ^^^^^^^^^^    edges: overlay opaque ^^^ -->`}</pre>
        </div>

        <div>
          <h3 className="text-base text-foreground-strong mb-2">Browser support note</h3>
          <p className="text-sm text-foreground-muted leading-relaxed">
            <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">mask-image</code> is
            Baseline 2023 — supported in all modern browsers. WebKit (Safari) previously required
            the <code className="rounded bg-surface-strong px-1.5 py-0.5 text-xs font-mono">-webkit-mask-image</code> prefix;
            it's no longer strictly needed but doesn't hurt to include. CORS applies — images must
            be same-origin or served with proper headers, otherwise the mask fails silently.
          </p>
        </div>
      </div>

      {/* Interactive examples */}
      <div className="flex flex-col gap-16">
        <DirectMaskExample />
        <OverlayMaskExample />
        <ImageMaskExample />
        <ImageVignetteMaskExample />
        <MultipleMaskExample />
      </div>

      {/* Further reading */}
      <div className="mt-12 rounded-lg border border-border-muted bg-surface-muted p-4">
        <p className="text-sm text-foreground-muted">
          Further reading:{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-default hover:underline"
          >
            MDN — mask-image
          </a>
          {' · '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-composite"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-default hover:underline"
          >
            MDN — mask-composite
          </a>
          {' · '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_masking"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-default hover:underline"
          >
            MDN — CSS Masking module
          </a>
        </p>
      </div>
    </SectionWrapper>
  );
}

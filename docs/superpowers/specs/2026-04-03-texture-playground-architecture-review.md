# Texture Playground - Architecture Review

**Date:** 2026-04-03  
**Source spec:** `2026-04-03-texture-playground-design.md`  
**Assumptions confirmed:**
- Loop-perfect export is required.
- Phase 2 filters/effects will be implemented.
- Desktop-only (no mobile/tablet support required).

---

## Executive take

PixiJS is still a valid choice given confirmed Phase 2 effect requirements, but the current spec has several weak points that could make export quality and long-term maintainability fragile unless architecture is tightened now.

---

## Key weaknesses

### 1) Frame-accurate export risk (critical)

The current export approach uses `captureStream + MediaRecorder` driven by runtime playback timing. This is convenient but not deterministic enough for loop-perfect output.

**Why weak:**
- Browser scheduling can drift from intended frame boundaries.
- Encoded output may include dropped/duplicated frames.
- End-of-recording timing can clip or extend the final loop by a small amount.

**Impact:** High, because loop-perfect output is a hard requirement.

**Recommendation:**
- Keep `captureStream + MediaRecorder` only as a fast preview export path.
- Add a deterministic export path that renders an exact frame sequence at fixed timesteps, then encodes from that exact sequence.

---

### 2) Full layer rebuild on every parameter change (high)

The spec states layers are rebuilt whenever parameters change.

**Why weak:**
- Causes avoidable CPU/GPU churn and garbage collection pressure.
- Becomes expensive at `2048` output size and with multiple layered compositions.
- Will worsen when Phase 2 filters are added.

**Recommendation:**
- Keep persistent display objects.
- Update only dirty properties/geometry for changed layers.
- Separate interactive preview updates from export rendering logic.

---

### 3) Rendering engine tightly coupled to UI state flow (high)

The proposed design directly binds React state changes to Pixi redraw orchestration.

**Why weak:**
- Makes future extraction to standalone repo harder.
- Limits ability to swap/compare rendering strategies.
- Increases blast radius when adding undo/save/project formats later.

**Recommendation:**
- Introduce a renderer adapter boundary now:
  - `init(canvasHost, size)`
  - `renderFrame(frame, options)`
  - `setSize(size)`
  - `exportPng(frame)`
  - `destroy()`
- Implement with Pixi first, keep orchestration renderer-agnostic.

---

### 4) Frame data model duplicates full layer arrays (medium)

Each frame stores complete `layers[]`.

**Why weak:**
- Repetition grows quickly for minor variations between frames.
- Harder to reason about small per-frame differences.
- Makes future timeline tooling and diffing less ergonomic.

**Recommendation:**
- Move to a base composition + per-frame overrides model.
- Keep full snapshot generation as an internal derived structure for rendering/export.

---

### 5) Lifecycle/memory hygiene not explicitly specified (medium)

Spec does not yet define cleanup and object URL disposal requirements.

**Why weak:**
- Image uploads use `objectUrl` and can leak memory if not revoked.
- Pixi resources/filters/textures can leak if destroy flow is incomplete.

**Recommendation:**
- Add explicit cleanup rules:
  - Revoke old object URLs on replace/delete.
  - Destroy Pixi app/resources on unmount.
  - Clear timeline playback timers/RAF loops on mode switches.

---

## Library decision (re-evaluated with constraints)

## Keep PixiJS, but formalize boundaries

Given confirmed Phase 2 effects, Pixi remains the strongest primary renderer option for this project.  
Alternatives are still useful references, but not preferred as the main engine now:

- **Konva:** excellent interaction/event model and export ergonomics; less compelling for your shader/filter-heavy direction.
- **Fabric.js:** strong object editing model, but heavier and less aligned to procedural layered texture generation.
- **Canvas 2D only:** simplest for phase 1, but weaker for the confirmed phase 2 filter roadmap.

**Decision guidance:** keep PixiJS, reduce risk via deterministic export and renderer abstraction.

---

## Suggested architecture adjustments before implementation

1. Define export modes:
   - `preview` (fast): `captureStream + MediaRecorder`
   - `deterministic` (production): exact frame-sequence renderer and strict loop duration
2. Introduce `RendererAdapter` interface before wiring controls.
3. Use dirty-layer updates instead of full rebuilds.
4. Refactor frame model to base + overrides.
5. Add explicit resource cleanup checklist to the spec.

---

## Success criteria updates

Add these acceptance criteria to the implementation checklist:

- Same project exports identical frame count and loop duration across repeated exports on the same machine.
- First and last frame continuity validated visually and by frame index checks.
- No memory growth after repeated image upload/replace/remove cycles.
- Playback and export both remain stable at `2048` with 5 frames and multiple layers.


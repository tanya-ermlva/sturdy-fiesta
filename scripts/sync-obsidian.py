#!/usr/bin/env python3
"""Portfolio → Obsidian vault sync.

Runs automatically via Claude Code Stop hook at end of every portfolio session.
Tracks what's been synced in VAULT/.sync-state.json — only appends new content.

Usage:
  python3 scripts/sync-obsidian.py
  python3 scripts/sync-obsidian.py --dry-run   (shows what would be synced)
  python3 scripts/sync-obsidian.py --reset      (clear sync state, re-sync everything)
"""

import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────

REPO  = Path("/Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio")
VAULT = Path("/Users/Tatiana/Dropbox/DesignProjects/-2024Coding/Portfolio-Notes")
STATE = VAULT / ".sync-state.json"
NOTES_FILE = REPO / "app/data/learning-notes.ts"
PLANS_DIR  = REPO / "docs/plans"

TODAY = date.today().isoformat()

# ── Category → Obsidian file mapping ──────────────────────────────────────────

CATEGORY_MAP = {
    ("CSS",                     "Positioning"):              "CSS & Tailwind/Positioning.md",
    ("CSS",                     "Layout"):                   "CSS & Tailwind/Layout & Spacing.md",
    ("CSS",                     "Fixed positioning"):        "CSS & Tailwind/Positioning.md",
    ("CSS",                     "Gradients"):                "CSS & Tailwind/Gradients.md",
    ("Tailwind",                "Basics"):                   "CSS & Tailwind/Layout & Spacing.md",
    ("Tailwind",                "Spacing"):                  "CSS & Tailwind/Layout & Spacing.md",
    ("Tailwind",                "Dark mode"):                "CSS & Tailwind/Dark Mode.md",
    ("Architecture",            "Next.js Project Structure"):"Architecture/Next.js Routing.md",
    ("Architecture",            "Component patterns"):       "Architecture/Component Patterns.md",
    ("Animation & JS",          "Framer Motion basics"):     "Animation/Framer Motion Basics.md",
    ("Animation & JS",          "Scroll-based behavior"):    "Animation/Animation Patterns.md",
    ("Animation & JS",          "Responsive patterns"):      "Architecture/Component Patterns.md",
    ("Animation (Framer Motion)","Core Concepts"):           "Animation/Framer Motion Basics.md",
    ("Animation (Framer Motion)","SVG Animation"):           "Animation/SVG Animation.md",
    ("Animation (Framer Motion)","Patterns"):                "Animation/Animation Patterns.md",
    ("Tools",                   "Vercel"):                   "Tools/Vercel.md",
    ("Tools",                   "macOS"):                    "Tools/macOS Tips.md",
    ("Tools",                   "CSS / Fonts"):              "Tools/Safari Gotchas.md",
    ("Tools",                   "How screens work"):         "Tools/How Screens Work.md",
    ("Git",                     "Worktrees"):                "Tools/Git.md",
    ("Git",                     "Basics"):                   "Tools/Git.md",
    ("Git",                     "Branching"):                "Tools/Git.md",
}

# ── State ──────────────────────────────────────────────────────────────────────

def load_state():
    if STATE.exists():
        try:
            return json.loads(STATE.read_text())
        except Exception:
            pass
    return {"synced_notes": [], "synced_plans": []}

def save_state(state):
    STATE.write_text(json.dumps(state, indent=2))

# ── TypeScript parser ─────────────────────────────────────────────────────────

def skip_brace_block(content, i):
    """Advance i past the next { ... } block (handles nesting). Returns new i."""
    depth = 0
    while i < len(content):
        if content[i] == "{":
            depth += 1
        elif content[i] == "}":
            depth -= 1
            if depth == 0:
                i += 1
                if i < len(content) and content[i] == "\n":
                    i += 1
                return i
        i += 1
    return i

def strip_ts_exports(content):
    """Remove all TypeScript-specific export declarations except 'export const learningNotes'."""
    BLOCK_KEYWORDS = ("interface ", "function ", "class ", "type ", "enum ")
    out = []
    i = 0
    while i < len(content):
        if content[i:].startswith("export "):
            rest = content[i + 7:]  # after 'export '
            if any(rest.startswith(kw) for kw in BLOCK_KEYWORDS):
                # Skip to end of block or statement
                if "{" in rest[:200]:
                    i = skip_brace_block(content, i)
                else:
                    # No body — skip to end of line
                    while i < len(content) and content[i] != "\n":
                        i += 1
                    i += 1
                continue
            elif rest.startswith("const learningNotes"):
                out.append("const learningNotes")
                i += len("export const learningNotes")
                continue
        out.append(content[i])
        i += 1
    return "".join(out)

def extract_notes_via_node():
    """Parse learning-notes.ts using Node.js — handles all TypeScript correctly."""
    raw = NOTES_FILE.read_text()

    # Transform TS → JS: strip all exports except the data const
    js = strip_ts_exports(raw)
    js = re.sub(r":\s*LearningCategory\[\]", "", js)
    js = re.sub(r":\s*FlatCard\[\]", "", js)
    js = re.sub(r" as const\b", "", js)
    js += "\nmodule.exports = { learningNotes };\n"

    with tempfile.NamedTemporaryFile(mode="w", suffix=".js", delete=False) as f:
        f.write(js)
        tmp = f.name

    try:
        result = subprocess.run(
            ["node", "-e", f"const d = require('{tmp}'); console.log(JSON.stringify(d.learningNotes))"],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode != 0:
            print(f"  ✗ Node parse error: {result.stderr[:300]}", file=sys.stderr)
            return None
        return json.loads(result.stdout)
    except Exception as e:
        print(f"  ✗ Failed to parse learning-notes.ts: {e}", file=sys.stderr)
        return None
    finally:
        os.unlink(tmp)

# ── Obsidian write helpers ─────────────────────────────────────────────────────

def update_date_in_frontmatter(content):
    return re.sub(r"(updated:\s*)\S+", rf"\g<1>{TODAY}", content)

def append_to_obsidian(rel_path, title, explanation, cat, sub, dry_run=False):
    target = VAULT / rel_path
    target.parent.mkdir(parents=True, exist_ok=True)

    section = f"\n## {title}\n\n{explanation}\n"

    if dry_run:
        print(f"  [dry-run] Would append '{title}' → {rel_path}")
        return

    if target.exists():
        content = update_date_in_frontmatter(target.read_text())
        target.write_text(content + section)
    else:
        tags = [cat.lower().replace(" & ", "-").replace(" ", "-"),
                sub.lower().replace(" ", "-")]
        content = f"---\ntags: [{', '.join(tags)}]\nupdated: {TODAY}\n---\n\n# {sub}\n{section}"
        target.write_text(content)

    print(f"  + '{title}' → {rel_path}")

# ── Sync: learning notes ───────────────────────────────────────────────────────

def sync_learning_notes(dry_run=False):
    state = load_state()
    synced = set(state.get("synced_notes", []))
    new_count = 0

    notes_data = extract_notes_via_node()
    if notes_data is None:
        return 0

    for cat_block in notes_data:
        cat = cat_block.get("category", "")
        for sub_block in cat_block.get("subcategories", []):
            sub = sub_block.get("name", "")
            for note in sub_block.get("notes", []):
                title       = note.get("title", "")
                explanation = note.get("explanation", "")
                key = f"{cat}|{sub}|{title}"

                if key in synced:
                    continue

                rel_path = CATEGORY_MAP.get((cat, sub))
                if rel_path is None:
                    rel_path = "Architecture/Misc.md"
                    print(f"  ⚠ No mapping for ({cat}, {sub}) → Architecture/Misc.md")

                append_to_obsidian(rel_path, title, explanation, cat, sub, dry_run)
                synced.add(key)
                new_count += 1

    if not dry_run:
        state["synced_notes"] = list(synced)
        save_state(state)

    return new_count

# ── Sync: plan files ───────────────────────────────────────────────────────────

def sync_plans(dry_run=False):
    state = load_state()
    synced = set(state.get("synced_plans", []))
    new_count = 0

    if not PLANS_DIR.exists():
        return 0

    obs_dir = VAULT / "Plans & Design Docs"
    obs_dir.mkdir(exist_ok=True)

    for plan_file in sorted(PLANS_DIR.glob("*.md")):
        if plan_file.stem in synced:
            continue

        obs_path = obs_dir / plan_file.name
        if obs_path.exists():
            synced.add(plan_file.stem)
            continue

        if dry_run:
            print(f"  [dry-run] Would create Plans & Design Docs/{plan_file.name}")
            new_count += 1
            continue

        plan_content = plan_file.read_text()
        # Strip "For Claude:" instruction lines
        plan_content = re.sub(r"^> \*\*For Claude:.*?\n\n", "", plan_content, flags=re.MULTILINE)

        obs_content = (
            f"---\ntags: [plans]\nupdated: {TODAY}\n"
            f"source: docs/plans/{plan_file.name}\n---\n\n"
            f"{plan_content}"
        )
        obs_path.write_text(obs_content)
        print(f"  + Plan: {plan_file.name}")

        synced.add(plan_file.stem)
        new_count += 1

    if not dry_run:
        state["synced_plans"] = list(synced)
        save_state(state)

    return new_count

# ── Main ───────────────────────────────────────────────────────────────────────

def seed_state():
    """Mark all current notes/plans as synced without touching Obsidian files.
    Run once after initial manual vault setup to avoid re-adding existing content.
    """
    notes_data = extract_notes_via_node()
    if notes_data is None:
        print("  ✗ Could not parse learning-notes.ts", file=sys.stderr)
        return

    synced_notes = []
    for cat_block in notes_data:
        cat = cat_block.get("category", "")
        for sub_block in cat_block.get("subcategories", []):
            sub = sub_block.get("name", "")
            for note in sub_block.get("notes", []):
                title = note.get("title", "")
                synced_notes.append(f"{cat}|{sub}|{title}")

    synced_plans = []
    if PLANS_DIR.exists():
        synced_plans = [f.stem for f in PLANS_DIR.glob("*.md")]

    state = {"synced_notes": synced_notes, "synced_plans": synced_plans}
    save_state(state)
    print(f"✓ Seeded state: {len(synced_notes)} notes, {len(synced_plans)} plans marked as synced")
    print("  Going forward, only NEW additions to learning-notes.ts will be appended.")


def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    reset   = "--reset"   in args
    seed    = "--seed"    in args

    if not VAULT.exists():
        sys.exit(0)  # Vault not set up yet — silent exit

    if not NOTES_FILE.exists():
        sys.exit(0)  # Not in portfolio repo — silent exit

    if seed:
        seed_state()
        return

    if reset:
        if STATE.exists():
            STATE.unlink()
        print("🔄 Sync state cleared. Re-syncing everything...")

    notes = sync_learning_notes(dry_run)
    plans = sync_plans(dry_run)

    total = notes + plans
    if total > 0:
        label = "[dry-run] " if dry_run else ""
        print(f"📚 {label}Obsidian sync: {notes} note(s), {plans} plan(s) added")
    # Silent if nothing new — don't spam the terminal

if __name__ == "__main__":
    main()

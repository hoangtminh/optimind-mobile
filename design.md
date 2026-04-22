# Design System Strategy: The Academic Sanctuary

## 1. Overview & Creative North Star

This design system is built to transform the "educational support" category from a utilitarian tool into a high-end, editorial environment. Our Creative North Star is **"The Academic Sanctuary."**

We are moving away from the cluttered, "dashboard-heavy" look of traditional ed-tech. Instead, we embrace a quiet, focused aesthetic that mimics the feeling of a premium physical library or a high-end architectural studio. This is achieved through intentional asymmetry—where large headlines are offset by generous white space—and a "Layered Depth" philosophy that replaces rigid lines with soft tonal transitions. The goal is to reduce cognitive load, allowing the user’s focus to remain entirely on the educational content.

## 2. Color & Surface Philosophy

The palette is rooted in professional stability (`primary` blue) and growth (`secondary` green), grounded by a sophisticated range of `surface` tones.

### The "No-Line" Rule

To maintain a premium, custom feel, **1px solid borders are strictly prohibited for sectioning content.** Boundaries must be defined solely through background color shifts.

- Use `surface_container_low` for large section backgrounds sitting on a `surface` base.
- Use `surface_container_highest` or `surface_container_lowest` to draw specific attention to interactive elements without using a stroke.

### Surface Hierarchy & Nesting

Think of the UI as a physical stack of paper.

- **Base Layer:** `surface` (The desk).
- **Section Layer:** `surface_container_low` (The folder).
- **Action/Card Layer:** `surface_container_lowest` (The paper).
  By nesting these levels, we create a clear visual hierarchy that feels organic and "built-in" rather than "pasted on."

### The "Glass & Gradient" Rule

For floating elements (modals, top navigation during scroll), use **Glassmorphism**. Apply a semi-transparent `surface_container_lowest` with a 20px backdrop-blur.
For primary CTAs, do not use flat colors. Apply a subtle linear gradient from `primary` to `primary_container` (135-degree angle). This provides a "soul" and depth that feels custom-engineered.

## 3. Typography: The Editorial Voice

We use **Inter** not just for legibility, but as an editorial tool.

- **Display & Headline (`display_lg` to `headline_sm`):** These are your "Anchors." Use `on_surface` for these, and don't be afraid of asymmetry. A `headline_lg` should often have more bottom margin (`spacing_8`) than top margin to feel like a title in a premium textbook.
- **Body (`body_lg` to `body_sm`):** Use `on_surface_variant` for body text to reduce visual vibration and create a softer, more professional reading experience.
- **Label (`label_md` to `label_sm`):** Always use these in `on_surface_variant` or `outline` for metadata. They should feel like "annotations" on the page.

## 4. Elevation & Depth: Tonal Layering

Traditional dropshadows are often a sign of "default" design. We use **Tonal Layering** first.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background to create a "lift" through color contrast alone.
- **Ambient Shadows:** Only use shadows for "floating" elements like FABs or active Modals. Shadows must be extra-diffused: `blur: 24px`, `opacity: 6%`, and tinted with the `on_surface` color (avoid pure black).
- **The "Ghost Border" Fallback:** If you must use a border for accessibility (e.g., in high-contrast needs), use a "Ghost Border": `outline_variant` at 15% opacity. Never use 100% opaque lines.

## 5. Component Guidelines

### Buttons (The "Soft-Tactile" Approach)

- **Primary:** Gradient (`primary` to `primary_container`), `rounded_md` (12px), white text.
- **Secondary:** Surface-only. Use `primary_fixed` background with `on_primary_fixed` text. No border.
- **Tertiary:** Text-only, using `primary` color, but with a `surface_container_high` hover state.

### Input Fields

Avoid the "boxed" look. Use a `surface_container_high` background with a bottom-only "active" indicator in `primary`. Use `label_md` as a floating label that stays visible to maintain the professional, organized feel.

### Cards & Lists (The "Breathable" List)

- **Forbid dividers.** Use `spacing_4` or `spacing_6` to separate list items.
- Cards should use `rounded_lg` (16px) for a modern, friendly feel.
- To separate content within a card, use a subtle background shift to `surface_container_highest` instead of a horizontal line.

### Progress Trackers (Context Specific)

Educational apps live on progress. Use a thick (8px) `surface_container_highest` track with a `secondary` (green) fill. The roundedness should be `full`.

## 6. Do’s and Don’ts

### Do

- **Do** use `spacing_12` and `spacing_16` for top-level padding. Breathing room is a luxury.
- **Do** use Lucide icons with a 1.5pt stroke. They should feel like fine-line illustrations.
- **Do** use `secondary` (#10B981) sparingly for "Success" and "Complete" states only.

### Don't

- **Don't** use pure black (#000000). Always use `on_surface` or `on_surface_variant`.
- **Don't** use standard "Material Design" blue. Stick to the refined `primary` (#0058be) and its tonal variants provided in the spec.
- **Don't** clutter the screen. If a piece of information isn't vital to the "Academic Sanctuary" focus, move it to a sub-menu or a "Ghost Border" tooltip.

---

**Director's Final Note:**
High productivity is not about how much data you can fit on one screen; it’s about how clearly the user can see the _next_ step. Use this design system to lead the user's eye through light, depth, and intentionality.

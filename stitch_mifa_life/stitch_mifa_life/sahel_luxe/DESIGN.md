# Design System Document: The Editorial Marketplace

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**
This design system moves away from the cluttered "warehouse" aesthetic of traditional e-commerce. Instead, it adopts the persona of a high-end digital curator. The goal is to blend the warmth of Malian culture with the precision of a Swiss editorial magazine. 

We achieve this through **Organic Asymmetry** and **Tonal Depth**. By breaking the rigid 12-column grid with overlapping elements (e.g., a product image bleeding slightly over a container boundary) and using high-contrast typography, we create a signature experience that feels bespoke, premium, and intentional. This is not just a place to buy; it is a place to discover.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the Mali national identity but elevated through a "muted-vibrant" lens.

### Color Tokens
*   **Primary (#006b26):** Used for high-intent CTAs and brand moments.
*   **Secondary (#725c00):** A sophisticated gold/yellow for accents and premium badges.
*   **Tertiary (#bb001e):** An authoritative red for critical alerts or limited-time offers.
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: #ffffff (Cards, Floating inputs)
    *   `surface`: #f6faff (Main page backgrounds)
    *   `surface-container-high`: #dfe9f3 (Section callouts)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Sectioning must be achieved through background shifts. For example, a product description section (`surface-container-low`) should sit adjacent to a main gallery (`surface`) without a line between them.

### Glass & Gradient Strategy
To avoid a flat, "templated" look, use **Glassmorphism** for sticky elements (Navbar, Bottom Sheets). Use a `surface` color at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Gradient:** For primary buttons, use a subtle linear gradient from `primary` (#006b26) to `primary_container` (#008732) at 135 degrees. This adds "soul" and prevents the UI from looking like a default UI kit.

---

## 3. Typography
We utilize a dual-font system to balance "Modernity" with "Editorial Authority."

*   **Display & Headlines (Plus Jakarta Sans):** This typeface provides a contemporary, geometric feel with a premium "tech" edge. 
    *   *Usage:* Use `display-lg` for hero marketing and `headline-md` for category titles.
*   **Body & Labels (Inter):** Chosen for its exceptional legibility at small scales, essential for a mobile-first e-commerce experience.
    *   *Usage:* All product descriptions, prices, and form labels.

**The Contrast Rule:** Always pair a `display-sm` (Bold) headline with `body-md` (Regular) subtext to create a clear information hierarchy that feels like a magazine spread.

---

## 4. Elevation & Depth
Depth in this system is organic, not artificial. We use **Tonal Layering** instead of structural lines.

*   **The Layering Principle:** Stack surfaces to create focus. A card (`surface-container-lowest`) placed on a section background (`surface-container-low`) creates a natural lift.
*   **Ambient Shadows:** For floating elements like "Add to Cart" sticky bars, use a "Ghost Shadow": 
    *   `box-shadow: 0 12px 32px -4px rgba(19, 29, 36, 0.06);`
    *   *Note:* The shadow color is a tinted version of the `on-surface` color, never pure black.
*   **The Ghost Border Fallback:** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Rounded-full (`9999px`), Gradient fill, White text.
*   **Secondary:** Ghost style. No fill, `outline` at 20% opacity, `primary` text color.
*   **Interaction:** On hover/active, the button should scale to `0.98` to provide tactile feedback mimicking a native app.

### Cards & Product Grids
*   **Rule:** Forbid divider lines.
*   **Styling:** Use `rounded-xl` (1.5rem) for product cards. The image should have a subtle `surface-variant` background to ensure products with white backgrounds don't "disappear." Use `spacing-4` (1rem) as the minimum padding between content blocks.

### Circular Categories
*   Use `full` rounding for category icons. 
*   Place the `label-md` text below, centered. 
*   To create the "Premium" feel, the active category should have a 2px `primary` ring with a `4px` offset—never a solid background fill.

### Input Fields
*   **The "Soft Input" Look:** Use `surface-container-highest` for the background. No borders.
*   **Focus State:** The background shifts to `surface-container-lowest` (white) with a `primary` 2px bottom-accent line only.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical padding in Hero sections (e.g., more padding on the left than the right) to create a sense of motion.
*   **Do** use `surface_tint` at 5% opacity for large empty states to keep the brand color present.
*   **Do** prioritize "Thumb-Zone" ergonomics. Place search and cart triggers within easy reach of the bottom of the screen.

### Don't:
*   **Don't** use 100% black (#000000). Always use `on_background` (#131d24) to maintain the premium "Slate" feel.
*   **Don't** use standard Material Design drop shadows. If it looks like a "box with a shadow," it’s too heavy. It should look like a "sheet on a surface."
*   **Don't** use dividers between list items. Use `spacing-3` of whitespace to separate them. Let the content breathe.
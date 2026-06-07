# Design System Specification: High-End Editorial African Tech

## 1. Overview & Creative North Star: "The Modern Sahelian Gallery"
This design system moves away from the "generic tech startup" aesthetic to embrace a "Modern Sahelian Gallery" North Star. We are not building a dashboard; we are curating a spectacular, high-end digital experience that honors Malian heritage through a lens of premium minimalism.

The system breaks the rigid, boxy nature of traditional UI by using **intentional asymmetry, overlapping editorial elements, and depth through tonal layering**. Large, authentic Malian lifestyle imagery should bleed off the edges of the grid, while typography uses dramatic scale shifts to command authority. We prioritize "breathing room" (whitespace) over information density to ensure every interaction feels premium and intentional.

---

### 2. Colors & Surface Philosophy
The palette is rooted in the Mali national colors, but executed with high-fashion restraint. 

#### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts.
*   **Example:** A `surface-container-low` (#f3f4f5) section sitting on a `surface` (#f8f9fa) background creates a sophisticated, invisible boundary.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of fine cotton paper.
*   **Base:** `surface` (#f8f9fa)
*   **Primary Containers:** Use `surface-container-lowest` (#ffffff) for high-impact content cards to create a natural "lift."
*   **Secondary Content:** Use `surface-container-high` (#e7e8e9) for sidebars or utility areas to create subtle recessed depth.

#### The "Glass & Signature Texture" Rule
*   **Glassmorphism:** For floating navigation or modal overlays, use semi-transparent versions of `surface` with a 20px+ backdrop-blur. This integrates the UI into the photography.
*   **Signature Gradients:** For CTAs and Hero backgrounds, use a subtle linear gradient from `primary` (#006b26) to `primary-container` (#008732). This adds "soul" and prevents the flat, synthetic look of standard hex fills.

---

### 3. Typography: The Editorial Voice
We use **Plus Jakarta Sans** as our sole typeface. Its geometric precision combined with modern quirks reflects a tech-forward Africa.

*   **Display Scale (The Hero):** Use `display-lg` (3.5rem) with `-0.04em` letter-spacing for high-impact headlines. This conveys a "Spectacular" brand presence.
*   **Headline Scale (The Story):** Use `headline-md` (1.75rem) for section titles. Ensure generous line-height (1.4) to maintain the editorial feel.
*   **Body Scale:** Use `body-lg` (1rem) for standard reading. 
*   **The Hierarchy Rule:** Always pair a `display-lg` headline with a `label-md` (0.75rem, uppercase, tracked out +10%) tag. This extreme contrast creates a professional, high-end rhythmic flow.

---

### 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often "muddy." This system uses ambient light and tone to communicate elevation.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, natural lift without a single pixel of shadow.
*   **Ambient Shadows:** When a float is required (e.g., a FAB or dropdown), use:
    *   `blur`: 40px
    *   `opacity`: 4%–6%
    *   `color`: A tinted version of `on-surface` (#191c1d). Never use pure black shadows.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. 100% opaque borders are strictly forbidden as they interrupt the visual flow.

---

### 5. Components: Principles of Interaction

#### Buttons
*   **Primary:** Uses the Mali Green gradient (`primary` to `primary-container`). Roundedness: `md` (1.5rem) or `full`.
*   **Secondary/Tertiary:** Never use a border. Use `secondary-container` (#fcd400) for high-visibility accents (The Gold accent) or `surface-variant` for subtle actions.
*   **Touch Targets:** Minimum 48px height for all interactive elements to ensure accessibility for mobile-first users.

#### Cards & Lists
*   **No Dividers:** Forbid the use of divider lines. Separate list items using the **Spacing Scale** (e.g., `4` or `5` units of vertical space) or alternating background shifts between `surface` and `surface-container-low`.
*   **Imagery:** All cards featuring Malian lifestyle imagery should have a minimum `DEFAULT` corner radius (1rem/16px).

#### Input Fields
*   **Aesthetic:** Use "Soft Inset" styling. Instead of a border, use a `surface-container-highest` (#e1e3e4) background fill. On focus, transition the background to `surface-container-lowest` (#ffffff) and add a subtle `primary` glow.

#### Chips & Badges
*   Use `tertiary-fixed` (#ffdad9) for Red accents in notifications or status indicators, ensuring the red feels "elegant" and muted rather than "alarming."

---

### 6. Do’s and Don’ts

#### Do:
*   **Do** use asymmetrical layouts where text is left-aligned and imagery is right-aligned but slightly overlapping the text container.
*   **Do** use high-quality, authentic Malian photography as a functional background element, not just decoration.
*   **Do** respect the `16px+` roundedness scale; sharp corners are antithetical to this system's "organic" feel.

#### Don't:
*   **Don't** use 1px solid black or grey borders. They break the premium "Gallery" illusion.
*   **Don't** use standard Material Design drop shadows.
*   **Don't** overcrowd the screen. If you feel like you need a divider line, you probably need more whitespace instead.
*   **Don't** use generic stock photography. Ensure imagery reflects real Malian life, textiles, and architecture.
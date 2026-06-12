---
name: Academic Excellence Marketplace
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#44474e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdc34d'
  on-secondary-container: '#715000'
  tertiary: '#180500'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d1500'
  on-tertiary-container: '#b97958'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f7bd48'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6c391d'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 16px
---

## Brand & Style
The design system is engineered to bridge the gap between rigorous academic tradition and the fast-paced energy of student entrepreneurship. It targets a university demographic that values security, professionalism, and ease of use. 

The aesthetic is **Corporate / Modern**, characterized by structured layouts, intentional use of white space, and a high-contrast color palette that signals authority. The UI should evoke a sense of "prestige meets productivity," ensuring students feel they are participating in a legitimate economy rather than a casual social feed. Visual elements are kept crisp and functional, avoiding unnecessary decoration in favor of a clean, organized marketplace experience.

## Colors
The palette is restricted to a triad of high-authority tones. 
- **Oxford Blue (#002147):** Used for all structural elements, headers, and primary typography. This anchors the design in academic tradition.
- **Academic Gold (#B8860B):** Reserved strictly for action-oriented elements. It is used for Call-to-Action (CTA) buttons, notifications, and highlighting active states or price points.
- **Pure White (#FFFFFF):** The foundation of the layout. High levels of white space are used to ensure the marketplace remains legible and organized on small screens.
- **Functional Greys:** A very light cool-grey is used for background fills in cards or section dividers to maintain depth without breaking the clean aesthetic.

## Typography
This design system utilizes two high-performance sans-serifs to establish a clear hierarchy. 
**Hanken Grotesk** is used for all headlines and labels. Its sharp, contemporary geometry provides a professional and forward-thinking character. 
**Inter** is the primary workhorse for body copy, chosen for its exceptional legibility in data-heavy marketplace listings and mobile interfaces. 

Hierarchy is established through weight rather than just size. Primary headings use Bold (700) in Oxford Blue to command attention, while utility labels use Semi-Bold (600) with increased letter-spacing for clarity at small sizes.

## Layout & Spacing
The layout follows a **mobile-first, 8pt grid system**. 
- **Mobile:** Uses a single-column layout with 16px outer margins. Internal padding within cards is consistently 16px to ensure touch targets are comfortable.
- **Desktop:** Transitions to a 12-column fixed grid (max-width 1200px) with 24px gutters. 
- **Rhythm:** Vertical spacing between disparate sections should be 32px (xl), while related elements (like a header and its description) should be 8px (base). This clear differentiation in spacing ensures the UI feels "organized" and navigable.

## Elevation & Depth
To maintain a modern and professional feel, depth is created through **subtle ambient shadows** rather than heavy outlines. 
- **Level 1 (Default):** Flat white background for the main page surface.
- **Level 2 (Cards):** Use a soft, diffused shadow (0px 4px 12px rgba(0, 33, 71, 0.08)) to lift product cards and containers off the background. 
- **Level 3 (Modals/Overlays):** A more pronounced shadow (0px 8px 24px rgba(0, 33, 71, 0.12)) for navigation drawers and pop-ups.
- **Interaction:** Buttons should subtly "lift" on hover/active states via a slight increase in shadow spread and opacity.

## Shapes
The design system employs a **Rounded (8px)** shape language. This "medium" radius is the perfect middle ground between the "sharp" corporate aesthetic of traditional law/finance apps and the "pill-shaped" playfulness of consumer social apps. 
- **Small Components:** Checkboxes and small tags use 4px (rounded-sm).
- **Standard Components:** Buttons, input fields, and product cards use 8px (base).
- **Large Components:** Hero sections or large banners use 16px (rounded-lg).

## Components
- **Buttons:** 
  - *Primary:* Academic Gold (#B8860B) background with White text. Bold, 8px corners.
  - *Secondary:* Oxford Blue (#002147) border (2px) with Oxford Blue text on a transparent background.
- **Input Fields:** White background with a 1px border in a muted blue-grey. On focus, the border shifts to Oxford Blue. 
- **Cards:** Product cards are the heart of the system. They feature a white background, 8px radius, and the subtle Level 2 shadow. Pricing should always be highlighted in Academic Gold.
- **Chips/Badges:** Used for category labels (e.g., "Textbooks," "Services"). These use a light Oxford Blue tint (5% opacity) with Oxford Blue text to keep them distinct but secondary to the main CTA.
- **Progressive Disclosure:** Use clean, chevron-based accordions for long academic descriptions or service details to keep the mobile interface organized.
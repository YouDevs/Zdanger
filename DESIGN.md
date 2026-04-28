---
name: Civic Vigilance & Community
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  margin: 32px
---

## Brand & Style

The design system is rooted in the principles of **Modern Corporate** efficiency blended with **Minimalist** clarity. The objective is to transform potentially distressing information into actionable, calm, and organized civic data. By prioritizing high-legibility typography and generous whitespace, the interface distances itself from the sensationalism of traditional crime reporting, instead positioning itself as a professional utility for public safety.

The aesthetic avoids aggressive motifs, opting for abstract map patterns and geometric civic iconography. The emotional response is one of empowered awareness—moving users from fear to informed participation.

## Colors

The palette is anchored by a deep **Primary Blue**, chosen for its historical association with institutional trust and stability. The **Background** uses a cool-toned off-white to reduce glare and provide a clean canvas for data.

- **Primary Blue:** Used for primary actions, active states, and authoritative branding.
- **Main Text:** High-contrast navy for maximum readability.
- **Muted Text:** Used for secondary metadata and decorative abstract map patterns.
- **Semantic Colors:** Reserved strictly for status indicators. The **Alert Red** is used for active threats, **Warning Amber** for historical trends or caution zones, and **Validated Green** to signify verified community reports.

## Typography

This design system utilizes **Inter** for its utilitarian and highly legible characteristics, particularly in digital map-based interfaces. 

- **Headlines:** Use tight letter-spacing and bold weights to convey importance without needing aggressive colors.
- **Body Text:** Set with generous line height to ensure clarity when reading report descriptions.
- **Labels:** Small caps or medium weights are used for data tags (e.g., timestamps, location coordinates) to distinguish them from narrative content.

## Layout & Spacing

The design system employs a **12-column fluid grid** for web applications and a 4-column fluid grid for mobile. 

A strict 8px spacing rhythm ensures vertical rhythm and consistent density. Generous padding (24px+) is mandated for card containers to prevent the UI from feeling "cluttered" or "anxious." Content should be grouped logically into clear sections to facilitate quick scanning during mobile use.

## Elevation & Depth

Depth is conveyed through **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

1.  **Level 0 (Surface):** The background (#F8FAFC) serves as the base.
2.  **Level 1 (Cards):** White surfaces with a very soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
3.  **Level 2 (Overlays/Modals):** Increased shadow spread (0px 12px 24px rgba(15, 23, 42, 0.1)) to draw focus for reporting workflows.

This soft approach to depth maintains the "approachable" civic feel while ensuring elements feel interactive and distinct.

## Shapes

The shape language is consistently **Rounded**, utilizing a base radius of 8px (0.5rem). This softens the "serious" nature of the platform, making it feel more like a community tool and less like a police application.

- **Buttons & Inputs:** 8px radius.
- **Cards:** 16px (1rem) radius for a friendly, modern container feel.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them as non-interactive status indicators.

## Components

- **Buttons:** Primary buttons use a solid Blue background with white text. Ghost buttons use a subtle gray outline for secondary actions like "Cancel" or "View Details."
- **Cards:** White containers with 1rem corner radius. They should feature a "header" section for the location pin and timestamp, and a "body" for the report data.
- **Location Pins:** Custom geometric pins using the semantic color logic (Red for recent, Green for verified). Pins should include a subtle pulse animation if the report is less than 1 hour old.
- **Input Fields:** Large, clear touch targets (min 48px height) with soft 8px corners and a 1px border that turns Primary Blue on focus.
- **Civic Icons:** Use a consistent 2px stroke weight. Icons like "Shield" (Protection), "Checkmark" (Verified), and "Alert" (Warning) should be used as visual anchors for categories.
- **Data Visualization:** Simple bar charts and heatmaps using the Primary Blue and Muted Text colors, avoiding "hot" colors (reds/oranges) unless displaying critical danger levels.
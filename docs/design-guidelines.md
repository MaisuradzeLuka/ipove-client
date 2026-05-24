# Ipove Design Guidelines — Moonlight

Readable reference for building the UI. All tokens live in `src/app/globals.css`. Prefer **Tailwind classes** in components; use **CSS variables** when you need custom CSS.

---

## Theme at a glance

**Moonlight** uses three brand colors:

| Name           | Hex       | Role                              |
| -------------- | --------- | --------------------------------- |
| **Dusk**       | `#1E1B4B` | Primary text, dark UI, footers    |
| **Starlight**  | `#F8FAFC` | Page background (cool gray-blue)  |
| **Periwinkle** | `#818CF8` | Buttons, links, focus, highlights |

Supporting tones: **Lilac** borders (`#C7D2FE`), **Periwinkle soft** sections (`#EEF2FF`), **Dusk muted** secondary text (`#6B6B9A`).

### Dark mode (`.dark` on `<html>`)

Same token names as light — values swap for a night-sky UI. Toggle via navbar theme control (`next-themes`).

| Token / surface        | Light     | Dark      | Role                              |
| ---------------------- | --------- | --------- | --------------------------------- |
| Page                   | `#F8FAFC` | `#09090F` | Starlight → neutral night           |
| Card / surface         | `#FFFFFF` | `#13141C` | White → elevated slate            |
| Elevated surface       | `#FFFFFF` | `#1B1D28` | Raised panels                     |
| Muted section          | `#EEF2FF` | `#161A2A` | Lavender band (subtle indigo)     |
| Subtle strip           | `#E2E8F4` | `#101118` | Table headers, strips             |
| Inverse block          | `#1E1B4B` | `#F8FAFC` | Footer / light-on-dark flip       |
| Primary text           | `#1E1B4B` | `#F8FAFC` | Dusk → starlight                  |
| Secondary text         | `#6B6B9A` | `#A1A8C4` | Muted labels                      |
| Border                 | `#C7D2FE` | `#2A2D3D` | Lilac → neutral border            |
| Accent                 | `#818CF8` | `#818CF8` | Periwinkle (unchanged)            |
| Accent hover           | `#6366F1` | `#A5B4FC` | Slightly brighter on dark         |
| Accent soft background | `#EEF2FF` | `#1A2238` | Soft highlight areas              |

**Layout rule (dark):** Page uses `bg-background` (`#09090F`). Cards use `bg-background-surface` (`#13141C`) — neutral slate, not full dusk purple.

---

## Quick decisions — “what do I use?”

| I need…                           | Use                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------- |
| Whole page / app shell            | `bg-background`                                                                  |
| Card, modal, dropdown panel       | `bg-background-surface` + `ring-1 ring-border`                                   |
| Hero band, sidebar, grouped block | `bg-background-muted`                                                            |
| Subtle strip, table header        | `bg-background-subtle`                                                           |
| Footer, dark banner               | `bg-background-inverse` + `text-foreground-inverse`                              |
| Modal backdrop                    | `bg-background-overlay`                                                          |
| Main heading / body               | `text-foreground`                                                                |
| Descriptions, captions            | `text-foreground-muted`                                                          |
| Hints, placeholders               | `text-foreground-subtle`                                                         |
| Primary button                    | `bg-accent` + `text-foreground-on-accent` + `hover:bg-accent-hover`              |
| Secondary button                  | `bg-background-surface` + `border-border` + `hover:bg-background-muted`          |
| Link                              | `text-foreground-accent` + `hover:text-accent-hover`                             |
| Default border                    | `border-border`                                                                  |
| Focus ring                        | `focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-ring-offset` |
| Success message                   | `bg-success-soft` + `text-success-foreground`                                    |
| Error message                     | `bg-error-soft` + `text-error-foreground`                                        |

---

## Backgrounds

```
Page (default)     →  bg-background          #F8FAFC  Starlight
Card / panel       →  bg-background-surface  #FFFFFF  White
Elevated card      →  bg-background-elevated #FFFFFF  White
Section / band     →  bg-background-muted    #EEF2FF  Lavender tint
Subtle strip       →  bg-background-subtle   #E2E8F4  Light slate
Dark block         →  bg-background-inverse  #1E1B4B  Dusk
Overlay            →  bg-background-overlay  60% Dusk
```

**Layout rule:** Page is never flat white. Use `bg-background` on `html`, `body`, and main layout. Put white only on **surfaces** (cards, inputs on cards).

**Example — page + card:**

```tsx
<main className="min-h-full bg-background">
  <article className="rounded-xl bg-background-surface p-6 shadow-sm ring-1 ring-border">
    …
  </article>
</main>
```

---

## Text

| Token         | Tailwind class              | When to use                     |
| ------------- | --------------------------- | ------------------------------- |
| Primary       | `text-foreground`           | Headings, body, labels          |
| Secondary     | `text-foreground-muted`     | Subtitles, meta, helper text    |
| Tertiary      | `text-foreground-subtle`    | Timestamps, faint hints         |
| Inverse       | `text-foreground-inverse`   | Text on `bg-background-inverse` |
| On accent     | `text-foreground-on-accent` | Text on primary buttons         |
| Accent / link | `text-foreground-accent`    | Links, emphasized words         |
| Disabled      | `text-foreground-disabled`  | Disabled controls               |

**Example — typography block:**

```tsx
<h1 className="text-2xl font-semibold text-foreground">Title</h1>
<p className="text-foreground-muted">Supporting line.</p>
<a href="#" className="text-foreground-accent hover:text-accent-hover">
  Learn more
</a>
```

---

## Accent & interactive

| State              | Background                | Text                        |
| ------------------ | ------------------------- | --------------------------- |
| Default            | `bg-accent`               | `text-foreground-on-accent` |
| Hover              | `hover:bg-accent-hover`   | —                           |
| Active / pressed   | `active:bg-accent-active` | —                           |
| Soft (badge, chip) | `bg-accent-soft`          | `text-foreground-accent`    |
| Muted highlight    | `bg-accent-muted`         | `text-foreground`           |

**Primary button:**

```tsx
<button
  type="button"
  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active">
  Save
</button>
```

**Secondary button:**

```tsx
<button
  type="button"
  className="rounded-lg border border-border bg-background-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-muted">
  Cancel
</button>
```

---

## Borders

| Token   | Tailwind                | Use for                         |
| ------- | ----------------------- | ------------------------------- |
| Default | `border-border`         | Cards, inputs, dividers (lilac) |
| Subtle  | `border-border-subtle`  | Very light separators           |
| Strong  | `border-border-strong`  | Emphasized outlines             |
| Inverse | `border-border-inverse` | Borders on dark backgrounds     |
| Focus   | `border-border-focus`   | Optional; prefer `ring-ring`    |

---

## Status colors

Use for alerts, toasts, form validation — not for primary UI chrome.

| Type    | Soft background   | Text on soft              | Solid (icons, dots)           |
| ------- | ----------------- | ------------------------- | ----------------------------- |
| Success | `bg-success-soft` | `text-success-foreground` | `text-success` / `bg-success` |
| Warning | `bg-warning-soft` | `text-warning-foreground` | `text-warning`                |
| Error   | `bg-error-soft`   | `text-error-foreground`   | `text-error`                  |
| Info    | `bg-info-soft`    | `text-info-foreground`    | `text-info`                   |

**Example — inline alert:**

```tsx
<div className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
  Something went wrong.
</div>
```

---

## Brand colors (direct)

Rarely needed; prefer semantic tokens above.

| Tailwind                            | Hex       |
| ----------------------------------- | --------- |
| `bg-dusk` / `text-dusk`             | `#1E1B4B` |
| `bg-starlight`                      | `#F8FAFC` |
| `bg-periwinkle` / `text-periwinkle` | `#818CF8` |

---

## Shadows

Dusk-tinted shadows — use on elevated surfaces only.

| Class       | Use                 |
| ----------- | ------------------- |
| `shadow-xs` | Subtle lift         |
| `shadow-sm` | Cards (default)     |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals              |
| `shadow-xl` | Large overlays      |

```tsx
<div className="rounded-xl bg-background-surface shadow-sm ring-1 ring-border">
```

---

## Radius

| CSS variable    | Tailwind       | Size           |
| --------------- | -------------- | -------------- |
| `--radius-sm`   | `rounded-sm`   | 6px            |
| `--radius-md`   | `rounded-md`   | 8px            |
| `--radius-lg`   | `rounded-lg`   | 12px           |
| `--radius-xl`   | `rounded-xl`   | 16px           |
| `--radius-full` | `rounded-full` | Pills, avatars |

**Convention:** Cards and modals → `rounded-xl`. Buttons and inputs → `rounded-lg`.

---

## Spacing scale

Use Tailwind spacing (`p-4`, `gap-6`) in components. Reference scale in CSS:

| Variable     | Value |
| ------------ | ----- |
| `--space-1`  | 4px   |
| `--space-2`  | 8px   |
| `--space-3`  | 12px  |
| `--space-4`  | 16px  |
| `--space-5`  | 20px  |
| `--space-6`  | 24px  |
| `--space-8`  | 32px  |
| `--space-10` | 40px  |
| `--space-12` | 48px  |
| `--space-16` | 64px  |

**Convention:** Page padding `px-6 py-16`. Card padding `p-6`. Stack sections with `gap-8`.

---

## Typography

**Font:** Geist Sans (`font-sans`), Geist Mono (`font-mono`).

| Use           | Classes                                         |
| ------------- | ----------------------------------------------- |
| Page title    | `text-3xl font-bold text-foreground`            |
| Section title | `text-xl font-semibold text-foreground`         |
| Body          | `text-base text-foreground` (default on `body`) |
| Small / meta  | `text-sm text-foreground-muted`                 |
| Caption       | `text-xs text-foreground-subtle`                |

| CSS variable       | Size |
| ------------------ | ---- |
| `--font-size-xs`   | 12px |
| `--font-size-sm`   | 14px |
| `--font-size-base` | 16px |
| `--font-size-lg`   | 18px |
| `--font-size-xl`   | 20px |
| `--font-size-2xl`  | 24px |
| `--font-size-3xl`  | 30px |
| `--font-size-4xl`  | 36px |

---

## Focus & accessibility

Always show focus for keyboard users:

```tsx
className =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";
```

Apply to buttons, links, inputs, and custom controls.

---

## Motion

| Variable            | Value |
| ------------------- | ----- |
| `--duration-fast`   | 150ms |
| `--duration-normal` | 200ms |
| `--duration-slow`   | 300ms |

```tsx
className = "transition-colors duration-200";
```

---

## Z-index

| Variable       | Layer |
| -------------- | ----- |
| `--z-dropdown` | 50    |
| `--z-sticky`   | 100   |
| `--z-modal`    | 200   |
| `--z-toast`    | 300   |

---

## Common patterns

### App shell

```tsx
<html className="h-full bg-background text-foreground">
  <body className="min-h-full bg-background">{children}</body>
</html>
```

### Card on page

```tsx
<section className="rounded-xl bg-background-muted p-6 ring-1 ring-border">
  <h2 className="font-semibold text-foreground">Section</h2>
  <p className="mt-1 text-sm text-foreground-muted">Muted band on starlight page.</p>
</section>

<article className="rounded-xl bg-background-surface p-6 shadow-sm ring-1 ring-border">
  …
</article>
```

### Input

```tsx
<input className="w-full rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground placeholder:text-foreground-subtle outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset" />
```

### Inverse footer

```tsx
<footer className="bg-background-inverse px-6 py-8 text-foreground-inverse">
  <p className="text-sm text-foreground-inverse/80">© Ipove</p>
</footer>
```

---

## CSS variables (custom styles)

When Tailwind is not enough, use variables from `:root`:

```css
.my-component {
  background: var(--background-muted);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```

Full list: see `src/app/globals.css` (`:root` block).

---

## Do / Don’t

**Do**

- Keep the page on `bg-background` (starlight).
- Use `bg-background-surface` for cards and inputs sitting on the page.
- Use `bg-background-muted` for sections that need a soft lavender band.
- Use periwinkle (`accent`) for one primary action per view.
- Pair `bg-background-inverse` with `text-foreground-inverse`.

**Don’t**

- Don’t use pure `#FFFFFF` for full-page backgrounds.
- Don’t use `bg-periwinkle` for large areas — it’s for accents only.
- Don’t mix random hex colors; add a token in `globals.css` first.
- Don’t use status reds/greens for normal buttons or navigation.

---

## File reference

| File                  | Purpose                                |
| --------------------- | -------------------------------------- |
| `src/app/globals.css` | All tokens + Tailwind `@theme` mapping |
| `src/app/layout.tsx`  | `bg-background` on `html` / `body`     |
| This document         | How and when to use tokens             |

---

_Last updated for Moonlight theme — single project palette._

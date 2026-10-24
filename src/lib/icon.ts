import type { LucideIcon, LucideProps } from '@lucide/svelte';

export type { LucideProps as IconProps };

/**
 * A Svelte component that renders an icon and takes the props of a Lucide icon
 * (`size`, `strokeWidth`, `class`, `aria-hidden`, …). Any `@lucide/svelte` icon
 * qualifies, as does an inline SVG component typed with `IconProps` (see
 * `icons/`).
 *
 * Components only pass `class` and `aria-hidden`; the size comes from CSS, so
 * the icon should fill its box (`width`/`height: 1em` or a fixed size is fine).
 */
export type IconComponent = LucideIcon;

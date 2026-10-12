import type { Component } from 'svelte';

/**
 * A Svelte component that renders an icon, from any icon library
 * (`@lucide/svelte`, `phosphor-svelte`, an inline SVG component, …).
 *
 * Components only pass `class` and `aria-hidden`; the size comes from CSS, so
 * the icon should fill its box (`width`/`height: 1em` or a fixed size is fine).
 */
export type IconComponent = Component<{
	class?: string;
	'aria-hidden'?: boolean | 'true' | 'false';
}>;

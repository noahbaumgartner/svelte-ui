<script lang="ts">
	/*
	 * Renders the small glyphs the components draw themselves (checkmarks,
	 * chevrons, …) so the library needs no icon package. The paths are taken
	 * from Lucide (https://lucide.dev), ISC License; portions Feather, MIT
	 * License, Copyright (c) 2013-2022 Cole Bemis. Icons passed in through an
	 * `icon` prop come from the consumer's own icon library, not from here.
	 */
	import type { SVGAttributes } from 'svelte/elements';

	type GlyphNode = [tag: string, attrs: Record<string, string | number>];

	type Props = SVGAttributes<SVGSVGElement> & { nodes: GlyphNode[] };

	let { nodes, ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	{...rest}
>
	{#each nodes as [tag, attrs], i (i)}
		<svelte:element this={tag} {...attrs} />
	{/each}
</svg>

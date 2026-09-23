<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAnchorAttributes, 'children'> & {
		/** External (http) links open in a new tab. */
		href: string;
		children: Snippet;
	};

	let { href, target, rel, class: className, children, ...rest }: Props = $props();

	let resolvedTarget = $derived(target ?? (href.startsWith('http') ? '_blank' : undefined));
	let resolvedRel = $derived(rel ?? (resolvedTarget === '_blank' ? 'noopener' : undefined));
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {...rest} {href} target={resolvedTarget} rel={resolvedRel} class={['link', className]}>
	{@render children()}
</a>

<style>
	.link {
		color: inherit;
		text-decoration: underline;
		text-decoration-thickness: max(1px, 0.0625em);
		text-underline-offset: 4px;
		outline: none;
		cursor: pointer;
		transition: opacity 200ms;
	}

	.link:hover {
		opacity: 0.6;
	}

	.link:focus-visible {
		text-decoration-thickness: max(2px, 0.125em);
	}
</style>

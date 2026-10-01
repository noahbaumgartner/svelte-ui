<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAnchorAttributes, 'children'> & {
		/** External (http) links open in a new tab. */
		href: string;
		children: Snippet;
		ref?: HTMLAnchorElement | null;
	};

	let {
		href,
		target,
		rel,
		class: className,
		children,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	let resolvedTarget = $derived(target ?? (href.startsWith('http') ? '_blank' : undefined));
	let resolvedRel = $derived(rel ?? (resolvedTarget === '_blank' ? 'noopener' : undefined));
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	{...rest}
	bind:this={ref}
	{href}
	target={resolvedTarget}
	rel={resolvedRel}
	class={['link', className]}
>
	{@render children()}
</a>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
	@layer svelte-ui {
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

		@media (prefers-reduced-motion: reduce) {
			.link {
				transition: none;
			}
		}

		@media (forced-colors: active) {
			.link {
				color: LinkText;
			}

			.link:hover {
				opacity: 1;
				text-decoration-thickness: max(2px, 0.125em);
			}

			.link:focus-visible {
				outline: 2px solid Highlight;
				outline-offset: 2px;
			}
		}

		@media (pointer: coarse) {
			.link {
				position: relative;
			}

			.link::after {
				content: '';
				position: absolute;
				inset: -12px -4px;
			}
		}
	}
</style>

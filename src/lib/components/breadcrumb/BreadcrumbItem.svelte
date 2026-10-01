<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import type { LucideIcon } from '@lucide/svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';

	type Props = Omit<HTMLLiAttributes, 'children'> & {
		/** The li element. Bindable. */
		ref?: HTMLLIElement | null;
		/** Links the item. Without it, the item is the current page. */
		href?: string;
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		href,
		icon: Icon,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

{#snippet content()}
	{#if Icon}<Icon class="breadcrumb-item-icon" aria-hidden="true" />{/if}
	{@render children()}
{/snippet}

<li {...rest} bind:this={ref} class={['breadcrumb-item', className]}>
	{#if href}
		<!-- href comes from the consumer, who resolves it; this library has no routes -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a {href} class="breadcrumb-link">{@render content()}</a>
	{:else}
		<span aria-current="page" class="breadcrumb-page">{@render content()}</span>
	{/if}
</li>
<BreadcrumbSeparator />

<style>
	@layer svelte-ui {
		.breadcrumb-item {
			display: inline-flex;
		}

		.breadcrumb-link,
		.breadcrumb-page {
			display: inline-flex;
			align-items: center;
			gap: 6px;
		}

		.breadcrumb-link {
			color: inherit;
			text-decoration: none;
			outline: none;
			border-radius: 4px;
			transition: color 200ms ease;
		}

		.breadcrumb-link:hover {
			color: var(--color-text);
		}

		.breadcrumb-link:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		.breadcrumb-page {
			color: var(--color-text);
		}

		@media (pointer: coarse) {
			.breadcrumb-link {
				min-height: 44px;
				min-width: 44px;
			}
		}

		@media (forced-colors: active) {
			.breadcrumb-link {
				color: LinkText;
			}

			.breadcrumb-link:focus-visible {
				outline-color: Highlight;
			}

			.breadcrumb-page {
				font-weight: 700;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.breadcrumb-link {
				transition: none;
			}
		}

		.breadcrumb-item :global(.breadcrumb-item-icon) {
			width: 14px;
			height: 14px;
			flex-shrink: 0;
		}
	}
</style>

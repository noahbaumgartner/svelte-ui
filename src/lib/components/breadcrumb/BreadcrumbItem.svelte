<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LucideIcon } from '@lucide/svelte';
	import BreadcrumbSeparator from './BreadcrumbSeparator.svelte';

	type Props = {
		/** Links the item. Without it, the item is the current page. */
		href?: string;
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		children: Snippet;
	};

	let { href, icon: Icon, children }: Props = $props();
</script>

{#snippet content()}
	{#if Icon}<Icon class="breadcrumb-item-icon" aria-hidden="true" />{/if}
	{@render children()}
{/snippet}

<li class="breadcrumb-item">
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
		outline: 2px solid var(--color-ink);
		outline-offset: 2px;
	}

	.breadcrumb-page {
		color: var(--color-text);
	}

	.breadcrumb-item :global(.breadcrumb-item-icon) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}
</style>

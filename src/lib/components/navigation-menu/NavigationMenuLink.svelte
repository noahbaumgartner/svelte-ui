<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LucideIcon } from '@lucide/svelte';
	import { getNavigationMenuContext } from './context.js';

	type Props = {
		href: string;
		/** Any Lucide icon (import from `svelte-ui/icons`). */
		icon?: LucideIcon;
		/** Short text below the title, clamped to two lines. */
		description?: string;
		/** Marks the link as the current page. */
		active?: boolean;
		/** The link's title. */
		children: Snippet;
	};

	let { href, icon: Icon, description, active = false, children }: Props = $props();

	const menu = getNavigationMenuContext();
	let classes = $derived(['navigation-menu-link', { 'navigation-menu-link--active': active }]);
</script>

<li>
	<!-- href comes from the consumer, who resolves it; this library has no routes -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} aria-current={active ? 'page' : undefined} class={classes} onclick={menu.close}>
		{#if Icon}<Icon class="navigation-menu-link-icon" aria-hidden="true" />{/if}
		<span class="navigation-menu-link-text">
			<span class="navigation-menu-link-title">{@render children()}</span>
			{#if description}
				<span class="navigation-menu-link-description">{description}</span>
			{/if}
		</span>
	</a>
</li>

<style>
	.navigation-menu-link {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 8px 10px;
		border-radius: 8px;
		font-size: 13px;
		line-height: 1.4;
		color: var(--color-text);
		text-decoration: none;
		outline: none;
		transition: background-color 150ms ease;
	}

	.navigation-menu-link:hover,
	.navigation-menu-link:focus-visible,
	.navigation-menu-link--active {
		background-color: var(--color-surface);
	}

	.navigation-menu-link:focus-visible {
		outline: 2px solid var(--color-ink);
		outline-offset: -2px;
	}

	.navigation-menu-link :global(.navigation-menu-link-icon) {
		width: 16px;
		height: 16px;
		margin-top: 1px;
		flex-shrink: 0;
	}

	.navigation-menu-link-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.navigation-menu-link-title {
		font-weight: 500;
	}

	.navigation-menu-link-description {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		font-size: 12px;
		color: var(--color-text-muted);
	}
</style>

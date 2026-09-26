<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { LucideIcon } from '@lucide/svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Button from '../button/Button.svelte';
	import ContextMenu from '../context-menu/ContextMenu.svelte';

	type Props = {
		/** Links the item. Ignored when the item has `items`. */
		href?: string;
		/** Any Lucide icon (import from `svelte-ui/icons`). Stays visible when the sidebar is collapsed to icons. */
		icon?: LucideIcon;
		/** Marks the item as the current page. */
		active?: boolean;
		/** Short count or status at the end of the item, e.g. unread messages. */
		badge?: string | number;
		/** Nested `SidebarMenuItem`s, shown in a submenu the item toggles. */
		items?: Snippet;
		/** Whether the submenu is open. Bindable. */
		expanded?: boolean;
		/** `ContextMenuItem`s for a menu revealed on hover. */
		menu?: Snippet;
		onclick?: () => void;
		children: Snippet;
	};

	let {
		href,
		icon: Icon,
		active = false,
		badge,
		items,
		expanded = $bindable(false),
		menu,
		onclick,
		children
	}: Props = $props();

	const id = $props.id();
	let classes = $derived(['sidebar-menu-button', { 'sidebar-menu-button--active': active }]);

	function toggle() {
		expanded = !expanded;
		onclick?.();
	}
</script>

{#snippet content()}
	{#if Icon}<Icon class="sidebar-menu-item-icon" aria-hidden="true" />{/if}
	<span class="sidebar-menu-item-label">{@render children()}</span>
	{#if badge !== undefined}<span class="sidebar-menu-item-badge">{badge}</span>{/if}
	{#if items}<ChevronRight class="sidebar-menu-item-chevron" aria-hidden="true" />{/if}
{/snippet}

<li class={['sidebar-menu-item', { 'sidebar-menu-item--has-menu': menu }]}>
	{#if items}
		<button
			type="button"
			aria-expanded={expanded}
			aria-controls={expanded ? `${id}-items` : undefined}
			class={classes}
			onclick={toggle}
		>
			{@render content()}
		</button>
	{:else if href}
		<!-- href comes from the consumer, who resolves it; this library has no routes -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a {href} aria-current={active ? 'page' : undefined} class={classes} {onclick}>
			{@render content()}
		</a>
	{:else}
		<button type="button" aria-current={active ? 'page' : undefined} class={classes} {onclick}>
			{@render content()}
		</button>
	{/if}

	{#if menu}
		<div class="sidebar-menu-item-menu">
			<ContextMenu align="end">
				{#snippet trigger(props)}
					<Button {...props} variant="ghost" size="sm" icon={Ellipsis} label="More" />
				{/snippet}
				{@render menu()}
			</ContextMenu>
		</div>
	{/if}

	{#if items && expanded}
		<ul id="{id}-items" class="sidebar-menu-sub" transition:slide={{ duration: 200 }}>
			{@render items()}
		</ul>
	{/if}
</li>

<style>
	.sidebar-menu-item {
		position: relative;
		min-width: 0;
	}

	.sidebar-menu-button {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		height: 32px;
		padding: 0 8px;
		box-sizing: border-box;
		overflow: hidden;
		background-color: transparent;
		border: none;
		border-radius: 8px;
		font: inherit;
		font-size: 13px;
		color: var(--color-text-secondary);
		text-align: left;
		text-decoration: none;
		outline: none;
		cursor: pointer;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			width 200ms ease;
	}

	.sidebar-menu-button:hover {
		background-color: var(--color-surface);
		color: var(--color-text);
	}

	.sidebar-menu-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.sidebar-menu-button--active {
		background-color: var(--color-surface);
		color: var(--color-text);
		font-weight: 500;
	}

	.sidebar-menu-item--has-menu > .sidebar-menu-button {
		padding-right: 36px;
	}

	.sidebar-menu-item :global(.sidebar-menu-item-icon) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.sidebar-menu-item-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.sidebar-menu-item-badge {
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--color-text-muted);
	}

	.sidebar-menu-item :global(.sidebar-menu-item-chevron) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
		color: var(--color-text-muted);
		transition: rotate 200ms ease;
	}

	.sidebar-menu-button[aria-expanded='true'] :global(.sidebar-menu-item-chevron) {
		rotate: 90deg;
	}

	/* Menu trigger, shown while the item is hovered or the menu has focus */
	.sidebar-menu-item-menu {
		position: absolute;
		top: 2px;
		right: 2px;
		opacity: 0;
		transition: opacity 150ms ease;
	}

	.sidebar-menu-item:hover > .sidebar-menu-item-menu,
	.sidebar-menu-item-menu:focus-within {
		opacity: 1;
	}

	@media (hover: none) {
		.sidebar-menu-item-menu {
			opacity: 1;
		}
	}

	.sidebar-menu-sub {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin: 2px 0 2px 15px;
		padding: 0 0 0 8px;
		list-style: none;
		border-left: 1px solid var(--color-border);
	}

	/* Collapsed to icons: a square button with the label clipped (it stays the accessible name) */
	:global(.sidebar--collapsed-icon) .sidebar-menu-item .sidebar-menu-button {
		width: 32px;
		padding: 0 8px;
	}

	:global(.sidebar--collapsed-icon) .sidebar-menu-item-menu,
	:global(.sidebar--collapsed-icon) .sidebar-menu-sub {
		display: none;
	}
</style>

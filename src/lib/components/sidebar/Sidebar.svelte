<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	import { getSidebarContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		side?: 'left' | 'right';
		/** `floating` detaches the sidebar from the edge as a rounded panel. */
		variant?: 'sidebar' | 'floating';
		/** What collapsing does: slide out (`offcanvas`), shrink to icons (`icon`) or nothing (`none`). */
		collapsible?: 'offcanvas' | 'icon' | 'none';
		/** `SidebarHeader`, `SidebarContent` and `SidebarFooter`. */
		children: Snippet;
	};

	let {
		side = 'left',
		variant = 'sidebar',
		collapsible = 'offcanvas',
		class: className,
		children,
		...rest
	}: Props = $props();

	const sidebar = getSidebarContext();

	let collapsed = $derived(!sidebar.mobile && !sidebar.open && collapsible !== 'none');
	let hidden = $derived(
		sidebar.mobile ? !sidebar.openMobile : collapsed && collapsible === 'offcanvas'
	);

	$effect(() => {
		if (!sidebar.openMobile) return;

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') sidebar.closeMobile();
		}

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if sidebar.mobile && sidebar.openMobile}
	<button
		type="button"
		tabindex="-1"
		aria-label="Close sidebar"
		class="sidebar-backdrop"
		onclick={sidebar.closeMobile}
		transition:fade={{ duration: 200 }}
	></button>
{/if}

<aside
	{...rest}
	id={sidebar.id}
	inert={hidden}
	data-state={collapsed ? 'collapsed' : 'expanded'}
	class={[
		'sidebar',
		`sidebar--${side}`,
		`sidebar--${variant}`,
		`sidebar--collapsible-${collapsible}`,
		collapsed && `sidebar--collapsed-${collapsible}`,
		sidebar.mobile && 'sidebar--mobile',
		sidebar.openMobile && 'sidebar--open-mobile',
		className
	]}
>
	<div class="sidebar-inner">
		{@render children()}
	</div>
</aside>

<style>
	.sidebar {
		position: sticky;
		top: 0;
		display: flex;
		flex-shrink: 0;
		width: var(--sidebar-width);
		height: var(--sidebar-height);
		overflow: hidden;
		transition: width 200ms ease;
	}

	/* The inner panel keeps its width while the outer one shrinks, so it slides out instead of squashing */
	.sidebar--left {
		justify-content: flex-end;
	}

	.sidebar--right {
		order: 1;
		justify-content: flex-start;
	}

	.sidebar--collapsed-offcanvas {
		width: 0;
	}

	.sidebar--collapsed-icon {
		width: var(--sidebar-width-icon);
	}

	.sidebar-inner {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		box-sizing: border-box;
		width: var(--sidebar-width);
		height: 100%;
		background-color: var(--color-bg);
		color: var(--color-text);
	}

	.sidebar--collapsible-icon .sidebar-inner {
		width: 100%;
	}

	/* Variants */

	.sidebar--sidebar.sidebar--left .sidebar-inner {
		border-right: 1px solid var(--color-border);
	}

	.sidebar--sidebar.sidebar--right .sidebar-inner {
		border-left: 1px solid var(--color-border);
	}

	.sidebar--floating .sidebar-inner {
		width: calc(var(--sidebar-width) - 16px);
		height: calc(100% - 16px);
		margin: 8px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	}

	.sidebar--floating.sidebar--collapsible-icon .sidebar-inner {
		width: calc(100% - 16px);
	}

	.sidebar--floating.sidebar--collapsed-icon {
		width: calc(var(--sidebar-width-icon) + 16px);
	}

	/* Mobile drawer */

	.sidebar--mobile {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 50;
		height: auto;
		transform: translateX(-100%);
		transition: transform 200ms ease;
	}

	.sidebar--mobile.sidebar--right {
		left: auto;
		right: 0;
		transform: translateX(100%);
	}

	.sidebar--mobile.sidebar--open-mobile {
		transform: none;
	}

	.sidebar-backdrop {
		position: fixed;
		inset: 0;
		z-index: 49;
		padding: 0;
		background-color: rgba(0, 0, 0, 0.4);
		border: none;
	}
</style>

<script module lang="ts">
	export type NavbarTriggerProps = {
		onclick: () => void;
		'aria-expanded': boolean;
		'aria-controls': string;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import type { TransitionConfig } from 'svelte/transition';
	import NavigationMenu from '../navigation-menu/NavigationMenu.svelte';

	type Props = {
		/** Whether the mobile menu is open. Bindable. */
		open?: boolean;
		/** Accessible name of the navigation landmark. */
		label?: string;
		/** Rendered at the start of the bar, e.g. a logo linking home. */
		logo?: Snippet;
		/** Rendered at the end of the bar on every screen size, e.g. a theme toggle. */
		actions?: Snippet;
		/**
		 * Renders the button that opens the mobile menu below 640px. Spread the given props onto it,
		 * e.g. `<Button {...props} icon={open ? X : Menu} label="Menu" />`.
		 */
		trigger: Snippet<[NavbarTriggerProps, boolean]>;
		/** `NavigationMenuItem`s, shown inline on desktop and stacked in the mobile menu. */
		children: Snippet;
	};

	let {
		open = $bindable(false),
		label = 'Main',
		logo,
		actions,
		trigger,
		children
	}: Props = $props();

	const id = $props.id();
	let triggerEl: HTMLDivElement;
	let height = $state(0);

	const triggerProps: NavbarTriggerProps = $derived({
		onclick: () => (open = !open),
		'aria-expanded': open,
		'aria-controls': `${id}-panel`
	});

	function close({ restoreFocus = false } = {}) {
		open = false;
		if (restoreFocus) triggerEl.querySelector<HTMLElement>('[aria-controls]')?.focus();
	}

	function handlePanelClick(event: MouseEvent) {
		if ((event.target as Element).closest('a[href]')) close();
	}

	/** Makes everything outside the navbar inert, so focus stays in the open menu. */
	function inertOutside(node: HTMLElement) {
		const changed: HTMLElement[] = [];
		for (let el = node; el.parentElement && el !== document.body; el = el.parentElement) {
			for (const sibling of el.parentElement.children) {
				if (sibling !== el && sibling instanceof HTMLElement && !sibling.inert) {
					sibling.inert = true;
					changed.push(sibling);
				}
			}
		}
		return () => changed.forEach((el) => (el.inert = false));
	}

	/** Uncovers the menu from the top while its content stays in place. */
	const reveal: (node: Element) => TransitionConfig = () => ({
		duration: prefersReducedMotion.current ? 0 : 250,
		easing: cubicOut,
		css: (t) => `clip-path: inset(0 0 ${(1 - t) * 100}% 0);`
	});

	const panel: Attachment<HTMLDivElement> = (node) => {
		node.querySelector<HTMLElement>('a[href], button')?.focus();
		return inertOutside(node.parentElement!);
	};

	$effect(() => {
		const desktop = window.matchMedia('(min-width: 640px)');
		const handleChange = () => desktop.matches && close();
		handleChange();
		desktop.addEventListener('change', handleChange);
		return () => desktop.removeEventListener('change', handleChange);
	});

	$effect(() => {
		if (!open) return;

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') close({ restoreFocus: true });
		}

		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', handleKeydown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<header class="navbar" bind:offsetHeight={height}>
	<div class="navbar-bar">
		<div class="navbar-start">
			{#if logo}{@render logo()}{/if}
			<div class="navbar-desktop">
				<NavigationMenu {label}>{@render children()}</NavigationMenu>
			</div>
		</div>

		<div class="navbar-end">
			{#if actions}{@render actions()}{/if}
			<div class="navbar-trigger" bind:this={triggerEl}>
				{@render trigger(triggerProps, open)}
			</div>
		</div>
	</div>

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			id="{id}-panel"
			class="navbar-panel"
			style:height="calc(100dvh - {height}px)"
			onclick={handlePanelClick}
			{@attach panel}
			transition:reveal
		>
			<NavigationMenu {label} orientation="vertical">{@render children()}</NavigationMenu>
		</div>
	{/if}
</header>

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background-color: var(--color-bg);
		user-select: none;
	}

	.navbar-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 16px;
	}

	.navbar-start {
		display: flex;
		align-items: center;
		gap: 40px;
		min-width: 0;
	}

	.navbar-end {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.navbar-desktop {
		display: none;
	}

	.navbar-trigger {
		display: flex;
	}

	/* Mobile menu: full-height, left-aligned rows below the bar */
	.navbar-panel {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		box-sizing: border-box;
		overflow-y: auto;
		overscroll-behavior: contain;
		background-color: var(--color-bg);
	}

	.navbar-panel :global(.navigation-menu) {
		padding: 40px 16px 32px;
	}

	.navbar-panel :global(.navigation-menu-list) {
		gap: 0;
	}

	/* Rows are padded into the gutter so the focus background has room; the text stays aligned */
	.navbar-panel :global(.navigation-menu-trigger) {
		box-sizing: content-box;
		gap: 8px;
		margin-inline: -10px;
		padding: 10px;
		border-radius: 10px;
		font-size: 22px;
		font-weight: 600;
		line-height: 1.2;
	}

	.navbar-panel :global(:is(.navigation-menu-trigger, .navigation-menu-link):focus-visible) {
		outline: none;
		background-color: var(--color-surface);
	}

	.navbar-panel :global(.navigation-menu-chevron) {
		width: 20px;
		height: 20px;
		color: var(--color-text-muted);
	}

	.navbar-panel :global(.navigation-menu-sub) {
		gap: 0;
		margin: 0 -10px;
		padding-bottom: 8px;
	}

	/* Sub-items show only their title */
	.navbar-panel :global(.navigation-menu-link) {
		font-size: 17px;
		color: var(--color-text-secondary);
	}

	.navbar-panel :global(.navigation-menu-link-title) {
		font-weight: 400;
	}

	.navbar-panel :global(.navigation-menu-link--active) {
		background-color: transparent;
		color: var(--color-text);
	}

	.navbar-panel :global(.navigation-menu-link--active .navigation-menu-link-title) {
		font-weight: 500;
	}

	.navbar-panel :global(:is(.navigation-menu-link-icon, .navigation-menu-link-description)) {
		display: none;
	}

	@media (min-width: 640px) {
		.navbar-desktop {
			display: flex;
		}

		.navbar-trigger,
		.navbar-panel {
			display: none;
		}
	}
</style>

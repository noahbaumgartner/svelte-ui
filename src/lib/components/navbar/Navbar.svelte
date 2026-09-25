<script module lang="ts">
	export type NavbarTriggerProps = {
		onclick: () => void;
		'aria-expanded': boolean;
		'aria-controls': string;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
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
			transition:slide={{ duration: 300 }}
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

	.navbar-panel {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		box-sizing: border-box;
		display: flex;
		overflow-y: auto;
		background-color: var(--color-bg);
	}

	.navbar-panel :global(.navigation-menu) {
		margin: auto;
		padding: 32px;
	}

	.navbar-panel :global(.navigation-menu-list) {
		align-items: center;
		gap: 24px;
	}

	.navbar-panel :global(.navigation-menu-trigger) {
		gap: 8px;
		font-size: 30px;
		font-weight: 600;
		line-height: 1.2;
	}

	.navbar-panel :global(.navigation-menu-chevron) {
		width: 24px;
		height: 24px;
	}

	.navbar-panel :global(.navigation-menu-sub) {
		margin-top: 12px;
	}

	.navbar-panel :global(.navigation-menu-link) {
		font-size: 16px;
	}

	.navbar-panel :global(.navigation-menu-link-description) {
		font-size: 14px;
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

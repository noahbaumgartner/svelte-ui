<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setNavigationMenuContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** Accessible name of the navigation landmark. */
		label?: string;
		/** `vertical` stacks the items and expands submenus in place, e.g. in a mobile menu. */
		orientation?: 'horizontal' | 'vertical';
		/** `NavigationMenuItem`s. */
		children: Snippet;
		ref?: HTMLElement | null;
	};

	let {
		label = 'Main',
		orientation = 'horizontal',
		class: className,
		children,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const openDelay = 200;
	const closeDelay = 200;

	let current: string | null = $state(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	setNavigationMenuContext({
		get vertical() {
			return orientation === 'vertical';
		},
		get current() {
			return current;
		},
		open(id, immediate = false) {
			clearTimeout(timer);
			if (immediate || current !== null) current = id;
			else timer = setTimeout(() => (current = id), openDelay);
		},
		leave() {
			clearTimeout(timer);
			timer = setTimeout(() => (current = null), closeDelay);
		},
		stay() {
			clearTimeout(timer);
		},
		close() {
			clearTimeout(timer);
			current = null;
		}
	});

	$effect(() => () => clearTimeout(timer));

	function handleKeydown(event: KeyboardEvent) {
		if (orientation === 'vertical') return;
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		const list = event.currentTarget as HTMLElement;
		const triggers = Array.from(
			list.querySelectorAll<HTMLElement>(':scope > li > .navigation-menu-trigger')
		);
		const index = triggers.indexOf(event.target as HTMLElement);
		if (index === -1) return;
		event.preventDefault();
		const step = event.key === 'ArrowRight' ? 1 : -1;
		triggers[(index + step + triggers.length) % triggers.length].focus();
	}
</script>

<nav
	{...rest}
	bind:this={ref}
	aria-label={label}
	class={[
		'navigation-menu',
		{ 'navigation-menu--vertical': orientation === 'vertical' },
		className
	]}
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul class="navigation-menu-list" onkeydown={handleKeydown}>
		{@render children()}
	</ul>
</nav>

<style>
	@layer svelte-ui {
		.navigation-menu {
			display: flex;
			user-select: none;
		}

		.navigation-menu-list {
			display: flex;
			align-items: center;
			gap: 24px;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.navigation-menu--vertical .navigation-menu-list {
			flex-direction: column;
			align-items: stretch;
			gap: 4px;
			width: 100%;
		}
	}
</style>

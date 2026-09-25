<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setNavigationMenuContext } from './context.js';

	type Props = {
		/** Accessible name of the navigation landmark. */
		label?: string;
		/** `NavigationMenuItem`s. */
		children: Snippet;
	};

	let { label = 'Main', children }: Props = $props();

	const openDelay = 200;
	const closeDelay = 200;

	let current: string | null = $state(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	setNavigationMenuContext({
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

<nav aria-label={label} class="navigation-menu">
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ul class="navigation-menu-list" onkeydown={handleKeydown}>
		{@render children()}
	</ul>
</nav>

<style>
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
</style>

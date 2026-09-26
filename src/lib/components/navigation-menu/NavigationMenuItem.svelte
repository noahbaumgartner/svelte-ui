<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { scale, slide } from 'svelte/transition';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { getNavigationMenuContext } from './context.js';

	type Props = {
		/** Links the item. Ignored when the item has `items`. */
		href?: string;
		/** Marks the item as the current page, or the section containing it. */
		active?: boolean;
		/** `NavigationMenuLink`s, shown in a panel the item opens on hover or click, or expanded in place in a vertical menu. */
		items?: Snippet;
		/** Number of columns the panel lays its links out in. Ignored in a vertical menu. */
		columns?: 1 | 2 | 3;
		children: Snippet;
	};

	let { href, active = false, items, columns = 1, children }: Props = $props();

	const id = $props.id();
	const menu = getNavigationMenuContext();
	const gap = 8;
	const edge = 8;

	let itemEl: HTMLLIElement;
	let triggerEl: HTMLButtonElement | undefined = $state();
	let contentEl: HTMLElement | undefined = $state();
	let position = $state({ top: 0, left: 0 });
	let open = $derived(menu.current === id);
	let classes = $derived([
		'navigation-menu-trigger',
		{ 'navigation-menu-trigger--active': active }
	]);

	function links() {
		return Array.from(contentEl?.querySelectorAll<HTMLElement>('a[href]') ?? []);
	}

	function hoverable(event: PointerEvent) {
		return !menu.vertical && event.pointerType !== 'touch';
	}

	function close({ restoreFocus = false } = {}) {
		menu.close();
		if (restoreFocus) triggerEl?.focus();
	}

	async function handleTriggerKeydown(event: KeyboardEvent) {
		if (menu.vertical || event.key !== 'ArrowDown') return;
		event.preventDefault();
		menu.open(id, true);
		await tick();
		links()[0]?.focus();
	}

	function handleContentKeydown(event: KeyboardEvent) {
		if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
		event.preventDefault();
		const list = links();
		const index = list.indexOf(document.activeElement as HTMLElement);
		const step = event.key === 'ArrowDown' ? 1 : -1;
		list[(index + step + list.length) % list.length]?.focus();
	}

	function place() {
		if (!triggerEl || !contentEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const max = window.innerWidth - contentEl.offsetWidth - edge;
		position = { top: rect.bottom + gap, left: Math.max(Math.min(rect.left, max), edge) };
	}

	const popover: Attachment<HTMLDivElement> = (node) => {
		node.showPopover();
		place();
	};

	$effect(() => {
		if (!open || menu.vertical) return;

		function handlePointerDown(event: PointerEvent) {
			if (!itemEl.contains(event.target as Node)) close();
		}

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') close({ restoreFocus: itemEl.contains(document.activeElement) });
		}

		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('scroll', place, true);
		window.addEventListener('resize', place);

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('scroll', place, true);
			window.removeEventListener('resize', place);
		};
	});
</script>

<li
	class={['navigation-menu-item', { 'navigation-menu-item--vertical': menu.vertical }]}
	bind:this={itemEl}
	onfocusout={(event) => {
		if (open && !menu.vertical && !itemEl.contains(event.relatedTarget as Node | null))
			menu.close();
	}}
>
	{#if items}
		<button
			type="button"
			class={classes}
			aria-expanded={open}
			aria-controls={open ? `${id}-content` : undefined}
			bind:this={triggerEl}
			onclick={() => (open ? close() : menu.open(id, true))}
			onkeydown={handleTriggerKeydown}
			onpointerenter={(event) => hoverable(event) && menu.open(id)}
			onpointerleave={(event) => hoverable(event) && menu.leave()}
		>
			{@render children()}
			<ChevronDown class="navigation-menu-chevron" aria-hidden="true" />
		</button>

		{#if open && menu.vertical}
			<ul
				id="{id}-content"
				class="navigation-menu-sub"
				bind:this={contentEl}
				transition:slide={{ duration: prefersReducedMotion.current ? 0 : 200 }}
			>
				{@render items()}
			</ul>
		{:else if open}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				id="{id}-content"
				popover="manual"
				class="navigation-menu-content"
				style:top="{position.top}px"
				style:left="{position.left}px"
				bind:this={contentEl}
				onpointerenter={menu.stay}
				onpointerleave={(event) => event.pointerType !== 'touch' && menu.leave()}
				onkeydown={handleContentKeydown}
				{@attach popover}
				transition:scale={{ duration: prefersReducedMotion.current ? 0 : 140, start: 0.95 }}
			>
				<ul class="navigation-menu-links" style:--columns={columns}>
					{@render items()}
				</ul>
			</div>
		{/if}
	{:else}
		<!-- href comes from the consumer, who resolves it; this library has no routes -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a {href} aria-current={active ? 'page' : undefined} class={classes}>{@render children()}</a>
	{/if}
</li>

<style>
	.navigation-menu-item {
		display: flex;
	}

	.navigation-menu-item--vertical {
		flex-direction: column;
	}

	.navigation-menu-item--vertical .navigation-menu-trigger {
		justify-content: space-between;
		width: 100%;
		text-align: left;
	}

	.navigation-menu-trigger {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 0;
		background: none;
		border: none;
		border-radius: 4px;
		font: inherit;
		font-size: 14px;
		line-height: 28px;
		color: var(--color-text);
		text-decoration: none;
		outline: none;
		cursor: pointer;
		transition: opacity 200ms;
	}

	.navigation-menu-trigger:hover {
		opacity: 0.6;
	}

	.navigation-menu-trigger:focus-visible {
		outline: 2px solid var(--color-ink);
		outline-offset: 2px;
	}

	.navigation-menu-trigger--active {
		font-weight: 500;
	}

	.navigation-menu-item :global(.navigation-menu-chevron) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
		transition: rotate 200ms ease;
	}

	.navigation-menu-trigger[aria-expanded='true'] :global(.navigation-menu-chevron) {
		rotate: 180deg;
	}

	.navigation-menu-content {
		position: fixed;
		inset: auto;
		box-sizing: border-box;
		max-width: calc(100vw - 16px);
		margin: 0;
		padding: 6px;
		overflow: visible;
		background-color: var(--color-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		transform-origin: top left;
		user-select: none;
	}

	.navigation-menu-links {
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		width: min(var(--columns) * 240px, 100vw - 30px);
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.navigation-menu-sub {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin: 4px 0 0;
		padding: 0;
		list-style: none;
	}
</style>

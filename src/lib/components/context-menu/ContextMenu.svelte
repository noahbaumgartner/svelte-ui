<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { setMenuContext, type ContextMenuTriggerProps } from './context.js';

	type Props = {
		/** Whether the menu is open. Bindable. */
		open?: boolean;
		/** Horizontal alignment of the menu relative to the trigger. */
		align?: 'start' | 'center' | 'end';
		/** Renders the trigger. Spread the given props onto it, e.g. `<Button {...props} />`. */
		trigger: Snippet<[ContextMenuTriggerProps]>;
		children: Snippet;
	};

	let { open = $bindable(false), align = 'start', trigger, children }: Props = $props();

	const id = $props.id();
	let side: 'top' | 'bottom' = $state('bottom');
	let wrapperEl: HTMLDivElement;
	let contentEl: HTMLDivElement | undefined = $state();

	function items() {
		return Array.from(
			contentEl?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)') ?? []
		);
	}

	async function show(focus: 'first' | 'last') {
		open = true;
		await tick();
		const list = items();
		const selected = list.find((item) => item.getAttribute('aria-checked') === 'true');
		(selected ?? (focus === 'first' ? list[0] : list.at(-1)))?.focus();
	}

	function close({ restoreFocus = false } = {}) {
		open = false;
		if (restoreFocus) wrapperEl.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus();
	}

	setMenuContext({ close: () => close({ restoreFocus: true }) });

	const triggerProps: ContextMenuTriggerProps = $derived({
		onclick: () => (open ? close() : show('first')),
		onkeydown: (event: KeyboardEvent) => {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				show(event.key === 'ArrowDown' ? 'first' : 'last');
			}
		},
		'aria-haspopup': 'menu',
		'aria-expanded': open,
		'aria-controls': `${id}-menu`
	});

	function handleMenuKeydown(event: KeyboardEvent) {
		const list = items();
		const index = list.indexOf(document.activeElement as HTMLElement);
		const last = list.length - 1;
		const target = {
			ArrowDown: index === last ? 0 : index + 1,
			ArrowUp: index <= 0 ? last : index - 1,
			Home: 0,
			End: last
		}[event.key];

		if (target !== undefined) {
			event.preventDefault();
			list[target]?.focus();
		} else if (event.key === 'Tab') {
			close();
		}
	}

	$effect(() => {
		if (!open) return;

		tick().then(() => {
			if (!contentEl) return;
			const triggerRect = wrapperEl.getBoundingClientRect();
			const contentHeight = contentEl.offsetHeight;
			const spaceBelow = window.innerHeight - triggerRect.bottom;
			side =
				spaceBelow < contentHeight + 8 && triggerRect.top > contentHeight + 8 ? 'top' : 'bottom';
		});

		function handlePointerDown(event: PointerEvent) {
			if (!wrapperEl.contains(event.target as Node)) close();
		}

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') close({ restoreFocus: true });
		}

		function handleScroll() {
			close();
		}

		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('scroll', handleScroll, true);

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('scroll', handleScroll, true);
		};
	});
</script>

<div class="context-menu" bind:this={wrapperEl}>
	{@render trigger(triggerProps)}

	{#if open}
		<div
			id="{id}-menu"
			role="menu"
			tabindex="-1"
			class={[
				'context-menu-content',
				`context-menu-content--${side}`,
				`context-menu-content--${align}`
			]}
			bind:this={contentEl}
			onkeydown={handleMenuKeydown}
			transition:scale={{ duration: 140, start: 0.95 }}
		>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.context-menu {
		position: relative;
		display: inline-flex;
		height: fit-content;
	}

	.context-menu-content {
		position: absolute;
		z-index: 60;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 160px;
		padding: 4px;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		outline: none;
		user-select: none;
	}

	.context-menu-content--bottom {
		top: calc(100% + 8px);
	}

	.context-menu-content--top {
		bottom: calc(100% + 8px);
	}

	.context-menu-content--start {
		left: 0;
	}

	.context-menu-content--center {
		left: 50%;
		transform: translateX(-50%);
	}

	.context-menu-content--end {
		right: 0;
	}

	.context-menu-content--bottom.context-menu-content--start {
		transform-origin: top left;
	}

	.context-menu-content--bottom.context-menu-content--center {
		transform-origin: top center;
	}

	.context-menu-content--bottom.context-menu-content--end {
		transform-origin: top right;
	}

	.context-menu-content--top.context-menu-content--start {
		transform-origin: bottom left;
	}

	.context-menu-content--top.context-menu-content--center {
		transform-origin: bottom center;
	}

	.context-menu-content--top.context-menu-content--end {
		transform-origin: bottom right;
	}
</style>

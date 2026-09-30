<script module lang="ts">
	export type DrawerTriggerProps = {
		onclick: () => void;
		'aria-haspopup': 'dialog';
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	type Props = {
		/**
		 * Whether the drawer is open. Bindable. A sheet from the bottom on phones, a panel on the right from 768px up.
		 * Escape, the handle or close button, dragging it away and a click on the backdrop close it.
		 */
		open?: boolean;
		title: string;
		description?: string;
		/** Renders the trigger. Spread the given props onto it, e.g. `<Button {...props} />`. Omit to control `open` yourself. */
		trigger?: Snippet<[DrawerTriggerProps]>;
		/** The drawer's content; scrolls when it is taller than the screen. The first focusable element in it gets the focus on open. */
		children?: Snippet;
		/** Optional Buttons in the footer, stacked at full width with the primary one last; it ends up on top. Call `close` to close the drawer. */
		actions?: Snippet<[close: () => void]>;
	};

	let { open = $bindable(false), title, description, trigger, children, actions }: Props = $props();

	const id = $props.id();
	let dialogEl: HTMLDialogElement;

	const triggerProps: DrawerTriggerProps = {
		onclick: () => (open = true),
		'aria-haspopup': 'dialog'
	};

	function close() {
		open = false;
	}

	$effect(() => {
		if (open && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl.open) {
			dialogEl.close();
		}
	});

	/* Dragging the header towards the edge moves the drawer along; letting go far enough or fast enough closes it */
	const slop = 4;
	let offset = $state(0);
	let dragging = $state(false);
	/* Matches the media query below: the panel on the right leaves sideways */
	let sideways = $state(false);
	let dragged = false;

	function startDrag(event: PointerEvent) {
		if (event.button !== 0) return;
		sideways = window.matchMedia('(min-width: 768px)').matches;
		const start = sideways ? event.clientX : event.clientY;
		const startTime = event.timeStamp;

		function move(e: PointerEvent) {
			const distance = (sideways ? e.clientX : e.clientY) - start;
			if (!dragging && Math.abs(distance) < slop) return;
			dragging = true;
			dragged = true;
			offset = Math.max(0, distance);
		}

		function end(e: PointerEvent) {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', end);
			window.removeEventListener('pointercancel', end);
			if (!dragging) return;
			const velocity = offset / Math.max(1, e.timeStamp - startTime);
			const dismiss =
				e.type === 'pointerup' &&
				(offset > (sideways ? dialogEl.offsetWidth : dialogEl.offsetHeight) / 3 || velocity > 0.5);
			dragging = false;
			offset = 0;
			if (dismiss) close();
			// The click that follows a drag ending on the handle must not count as a tap on it
			setTimeout(() => (dragged = false));
		}

		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', end);
		window.addEventListener('pointercancel', end);
	}
</script>

{@render trigger?.(triggerProps)}

<dialog
	bind:this={dialogEl}
	aria-labelledby="{id}-title"
	aria-describedby={description ? `${id}-description` : undefined}
	class={['drawer', { 'drawer--dragging': dragging }]}
	style:translate={dragging ? (sideways ? `${offset}px 0` : `0 ${offset}px`) : undefined}
	onkeydown={(event) => {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		close();
	}}
	oncancel={(event) => {
		event.preventDefault();
		close();
	}}
	onclose={() => (open = false)}
	onclick={(event) => {
		// Clicks on the ::backdrop target the <dialog> itself, outside its box
		if (event.target !== dialogEl) return;
		const rect = dialogEl.getBoundingClientRect();
		const inside =
			event.clientX >= rect.left &&
			event.clientX <= rect.right &&
			event.clientY >= rect.top &&
			event.clientY <= rect.bottom;
		if (!inside) close();
	}}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="drawer-header" onpointerdown={startDrag}>
		<h2 id="{id}-title" class="drawer-title">{title}</h2>
		{#if description}
			<p id="{id}-description" class="drawer-description">{description}</p>
		{/if}
	</div>
	{#if children}
		<div class="drawer-body">{@render children()}</div>
	{/if}
	{#if actions}
		<div class="drawer-actions">{@render actions(close)}</div>
	{/if}
	<!-- Last in the DOM so the content, not the handle, gets the initial focus -->
	<button
		type="button"
		class="drawer-handle"
		aria-label="Close"
		onpointerdown={startDrag}
		onclick={() => {
			if (!dragged) close();
		}}
	>
		<span class="drawer-handle-bar"></span>
		<X class="drawer-handle-icon" aria-hidden="true" />
	</button>
</dialog>

<style>
	/* Locks page scrolling while open; the gutter keeps the layout from shifting */
	:global(html:has(.drawer[open])) {
		overflow: hidden;
		scrollbar-gutter: stable;
	}

	.drawer {
		box-sizing: border-box;
		width: 100%;
		max-width: 560px;
		max-height: calc(100dvh - 48px);
		flex-direction: column;
		/* Pinned to the bottom edge */
		margin: auto auto 0;
		padding: 0 0 env(safe-area-inset-bottom);
		overflow: hidden;
		background-color: var(--color-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-bottom: 0;
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
		outline: none;
		translate: 0 100%;
		transition:
			translate 260ms cubic-bezier(0.32, 0.72, 0, 1),
			display 260ms allow-discrete,
			overlay 260ms allow-discrete;
	}

	.drawer[open] {
		display: flex;
		translate: 0 0;
	}

	/* Follows the finger directly */
	.drawer--dragging {
		transition: none;
	}

	.drawer::backdrop {
		background-color: rgba(0, 0, 0, 0);
		transition:
			background-color 260ms ease,
			display 260ms allow-discrete,
			overlay 260ms allow-discrete;
	}

	.drawer[open]::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
	}

	@starting-style {
		.drawer[open] {
			translate: 0 100%;
		}

		.drawer[open]::backdrop {
			background-color: rgba(0, 0, 0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.drawer,
		.drawer::backdrop {
			transition-duration: 0ms;
		}
	}

	.drawer-header {
		flex-shrink: 0;
		/* Room for the handle */
		padding: 28px 20px 12px;
		cursor: grab;
		user-select: none;
		/* Dragging must not scroll the page or get cancelled by the browser */
		touch-action: none;
	}

	.drawer--dragging .drawer-header,
	.drawer--dragging .drawer-handle {
		cursor: grabbing;
	}

	.drawer-title {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
	}

	.drawer-description {
		margin: 6px 0 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.drawer-body {
		min-height: 0;
		padding: 4px 20px 20px;
		overflow-y: auto;
		overscroll-behavior: contain;
		font-size: 13px;
	}

	/* Stacked, the primary action (last in the markup) on top */
	.drawer-actions {
		display: flex;
		flex-shrink: 0;
		flex-direction: column-reverse;
		gap: 8px;
		padding: 4px 20px 20px;
	}

	.drawer-actions :global(.button) {
		width: 100%;
	}

	.drawer-handle {
		position: absolute;
		top: 0;
		left: 50%;
		padding: 10px 24px;
		background: none;
		border: 0;
		border-radius: 8px;
		cursor: grab;
		translate: -50% 0;
		touch-action: none;
		-webkit-tap-highlight-color: transparent;
	}

	.drawer-handle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -4px;
	}

	.drawer-handle-bar {
		display: block;
		width: 36px;
		height: 4px;
		background-color: var(--color-border-strong);
		border-radius: 2px;
		transition: background-color 120ms ease;
	}

	.drawer-handle:hover .drawer-handle-bar {
		background-color: var(--color-text-faint);
	}

	.drawer-handle :global(.drawer-handle-icon) {
		display: none;
		width: 16px;
		height: 16px;
	}

	/* Larger screens: a floating panel on the right, with a close button instead of the handle */
	@media (min-width: 768px) {
		.drawer {
			width: 400px;
			max-width: calc(100% - 48px);
			height: calc(100dvh - 2 * var(--drawer-inset));
			max-height: none;
			/* Floats with a gap to the screen edges */
			--drawer-inset: 8px;
			margin: var(--drawer-inset) var(--drawer-inset) var(--drawer-inset) auto;
			padding: 0;
			border: 1px solid var(--color-border);
			border-radius: 20px;
			box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
			translate: calc(100% + var(--drawer-inset)) 0;
		}

		@starting-style {
			.drawer[open] {
				translate: calc(100% + var(--drawer-inset)) 0;
			}
		}

		.drawer-header {
			padding: 20px 56px 12px 20px;
		}

		/* Pushes the actions to the bottom */
		.drawer-body {
			flex: 1;
		}

		.drawer-handle {
			top: 14px;
			right: 14px;
			left: auto;
			padding: 6px;
			color: var(--color-text-muted);
			cursor: pointer;
			translate: none;
		}

		.drawer-handle:hover {
			color: var(--color-text);
			background-color: var(--color-surface);
		}

		.drawer-handle:focus-visible {
			outline-offset: 2px;
		}

		.drawer-handle-bar {
			display: none;
		}

		.drawer-handle :global(.drawer-handle-icon) {
			display: block;
		}
	}
</style>

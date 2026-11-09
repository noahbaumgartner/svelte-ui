<script lang="ts" generics="T">
	import { tick, type Snippet } from 'svelte';
	import { flip } from 'svelte/animate';
	import type { HTMLAttributes } from 'svelte/elements';
	import GripVertical from '../../internal/icons/GripVertical.svelte';

	type Key = string | number;

	type Props = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
		items: T[];
		/** Stable identity of an entry. */
		key: (item: T) => Key;
		/** Renders one entry. Render `handle` where the drag handle should sit. */
		item: Snippet<[item: T, handle: Snippet]>;
		/** Accessible name of an entry's handle, e.g. `Move ${item.name}`. */
		handleLabel?: (item: T) => string;
		/** Screen reader announcement after an entry moved. */
		announce?: (item: T, position: number, total: number) => string;
		disabled?: boolean;
		/**
		 * Shows a handle only while its entry is hovered or the handle has focus, on devices with a
		 * mouse. Touch devices always show the handles.
		 */
		revealHandles?: boolean;
		/** The list element. Bindable. */
		ref?: HTMLUListElement | null;
		/** Called with the new order once a drag or an arrow key moved an entry. */
		onreorder?: (items: T[]) => void;
	};

	let {
		items,
		key,
		item,
		handleLabel = () => 'Move',
		announce = (_, position, total) => `Position ${position} of ${total}`,
		disabled = false,
		revealHandles = false,
		ref = $bindable(null),
		class: className,
		onreorder,
		...rest
	}: Props = $props();

	/** Follows `items`, but is reordered locally while dragging. */
	let order = $derived(items);
	let dragging = $state<Key | null>(null);
	let offset = $state(0);
	let message = $state('');
	let hovered = $state<Key | null>(null);

	let initial: T[] = [];
	let grab = 0;
	let pointerId = -1;
	let pointerX = 0;
	let pointerY = 0;
	let frame = 0;

	const reducedMotion =
		typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function elementAt(index: number) {
		return ref?.children[index] as HTMLElement | undefined;
	}

	function moved(list: T[], from: number, to: number) {
		const next = [...list];
		next.splice(to, 0, ...next.splice(from, 1));
		return next;
	}

	function start(event: PointerEvent, entry: T) {
		if (disabled || event.button !== 0 || dragging !== null) return;
		const element = elementAt(order.findIndex((value) => key(value) === key(entry)));
		if (!element) return;
		event.preventDefault();
		// No pointer capture: moving the dragged entry in the DOM would release it and end the drag.
		// The window listeners below follow the pointer instead.
		pointerId = event.pointerId;
		initial = order;
		grab = event.clientY - element.getBoundingClientRect().top;
		pointerX = event.clientX;
		pointerY = event.clientY;
		offset = 0;
		dragging = key(entry);
		frame = requestAnimationFrame(scroll);
	}

	function move(event: PointerEvent) {
		if (dragging === null || event.pointerId !== pointerId) return;
		pointerX = event.clientX;
		pointerY = event.clientY;
		update();
	}

	/** Moves the dragged entry into the slot under the pointer and lets it follow the pointer. */
	function update() {
		if (!ref || dragging === null) return;
		const index = order.findIndex((entry) => key(entry) === dragging);
		const element = elementAt(index);
		if (!element) return;
		const list = ref.getBoundingClientRect();
		const max = ref.clientHeight - element.offsetHeight;
		const top = Math.min(Math.max(pointerY - list.top - ref.clientTop - grab, 0), max);
		// Edges, not centres: a tall entry clamped at the end of the list could otherwise never pass a
		// short neighbour. Moving down, the bottom edge passes the neighbour's middle; moving up, the top.
		const bottom = top + element.offsetHeight;
		let target = index;
		for (let i = index + 1; i < order.length; i++) {
			const other = elementAt(i);
			if (other && bottom > other.offsetTop + other.offsetHeight / 2) target = i;
		}
		for (let i = index - 1; i >= 0; i--) {
			const other = elementAt(i);
			if (other && top < other.offsetTop + other.offsetHeight / 2) target = i;
		}
		if (target !== index) {
			order = moved(order, index, target);
			tick().then(() => (offset = top - element.offsetTop));
		}
		offset = top - element.offsetTop;
	}

	/** Scrolls the nearest scroll container while the pointer is near the top or bottom edge. */
	function scroll() {
		if (dragging === null || !ref) return;
		const container = scrollParent(ref);
		const bounds =
			container === document.scrollingElement
				? { top: 0, bottom: innerHeight }
				: container.getBoundingClientRect();
		const edge = 56;
		const delta =
			pointerY < bounds.top + edge
				? -(bounds.top + edge - pointerY)
				: pointerY > bounds.bottom - edge
					? pointerY - (bounds.bottom - edge)
					: 0;
		if (delta !== 0) {
			container.scrollBy(0, delta / 3);
			update();
		}
		frame = requestAnimationFrame(scroll);
	}

	function scrollParent(node: HTMLElement): Element {
		for (let parent = node.parentElement; parent; parent = parent.parentElement) {
			const { overflowY } = getComputedStyle(parent);
			if (/(auto|scroll)/.test(overflowY) && parent.scrollHeight > parent.clientHeight)
				return parent;
		}
		return document.scrollingElement ?? document.documentElement;
	}

	function end(commit = true) {
		if (dragging === null) return;
		cancelAnimationFrame(frame);
		const entry = order.find((value) => key(value) === dragging);
		dragging = null;
		offset = 0;
		// The pointer was captured while dragging, so no entry saw it enter or leave.
		tick().then(syncHovered);
		if (!commit) order = initial;
		else if (entry && order.some((value, i) => value !== initial[i])) {
			message = announce(entry, order.indexOf(entry) + 1, order.length);
			onreorder?.(order);
		}
	}

	/** Marks the entry under the pointer as hovered, so its handle stays visible after a drop. */
	function syncHovered() {
		if (!ref) return;
		// Walk up to this list's own entry; the pointer may be over an entry of a nested list.
		let under = document.elementFromPoint(pointerX, pointerY);
		while (under && under.parentElement !== ref) under = under.parentElement;
		const index = under ? Array.prototype.indexOf.call(ref.children, under) : -1;
		hovered = index >= 0 && order[index] !== undefined ? key(order[index]) : null;
	}

	async function nudge(event: KeyboardEvent, index: number) {
		if (disabled || dragging !== null) return;
		const target =
			event.key === 'ArrowUp'
				? index - 1
				: event.key === 'ArrowDown'
					? index + 1
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? order.length - 1
							: null;
		if (target === null) return;
		event.preventDefault();
		if (target < 0 || target >= order.length || target === index) return;
		const entry = order[index];
		order = moved(order, index, target);
		message = announce(entry, target + 1, order.length);
		onreorder?.(order);
		await tick();
		elementAt(target)?.querySelector<HTMLElement>('[data-sortable-handle]')?.focus();
	}
</script>

<svelte:window
	onpointermove={move}
	onpointerup={(event) => {
		if (event.pointerId === pointerId) end();
	}}
	onpointercancel={(event) => {
		if (event.pointerId === pointerId) end();
	}}
	onkeydown={(event) => {
		if (event.key === 'Escape' && dragging !== null) end(false);
	}}
/>

<ul
	{...rest}
	bind:this={ref}
	class={['sortable-list', { 'sortable-list--dragging': dragging !== null }, className]}
>
	{#each order as entry, index (key(entry))}
		{@const active = dragging === key(entry)}
		{@const hidden = revealHandles && !active && hovered !== key(entry)}
		<li
			class={['sortable-list-item', { 'sortable-list-item--dragging': active }]}
			onpointerenter={(event) => {
				if (event.pointerType === 'mouse') hovered = key(entry);
			}}
			onpointerleave={() => {
				if (hovered === key(entry)) hovered = null;
			}}
			style:transform={active ? `translateY(${offset}px)` : undefined}
			animate:flip={{ duration: active || reducedMotion ? 0 : 160 }}
		>
			{#snippet handle()}
				<button
					type="button"
					class={['sortable-list-handle', { 'sortable-list-handle--hidden': hidden }]}
					data-sortable-handle
					aria-label={handleLabel(entry)}
					{disabled}
					onpointerdown={(event) => start(event, entry)}
					onkeydown={(event) => nudge(event, index)}
				>
					<GripVertical aria-hidden="true" />
				</button>
			{/snippet}
			{@render item(entry, handle)}
		</li>
	{/each}
</ul>
<span class="sortable-list-status" role="status" aria-live="polite">{message}</span>

<style>
	@layer svelte-ui {
		.sortable-list {
			position: relative;
			display: flex;
			flex-direction: column;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.sortable-list--dragging {
			user-select: none;
			-webkit-user-select: none;
		}

		.sortable-list-item {
			position: relative;
		}

		.sortable-list-item--dragging {
			z-index: 1;
			border-radius: var(--sortable-list-dragging-radius, 10px);
			background: var(--sortable-list-dragging-background, transparent);
			box-shadow: var(
				--sortable-list-dragging-shadow,
				0 6px 18px -6px color-mix(in srgb, var(--color-shadow) 14%, transparent)
			);
		}

		.sortable-list-handle {
			display: inline-flex;
			flex: none;
			align-items: center;
			justify-content: center;
			width: var(--sortable-list-handle-width, 24px);
			height: var(--sortable-list-handle-height, 32px);
			margin: 0;
			padding: 0;
			color: var(--color-text-faint);
			background: transparent;
			border: none;
			border-radius: 6px;
			cursor: grab;
			touch-action: none;
			transition:
				opacity 120ms ease,
				color 120ms ease;
		}

		.sortable-list-handle :global(svg) {
			width: 16px;
			height: 16px;
		}

		.sortable-list-handle:hover:not(:disabled) {
			color: var(--color-text-muted);
		}

		@media (hover: hover) and (pointer: fine) {
			.sortable-list-handle--hidden:not(:focus-visible) {
				opacity: 0;
			}
		}

		.sortable-list-handle:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 0;
		}

		.sortable-list-handle:disabled {
			cursor: default;
			opacity: 0.4;
		}

		.sortable-list-item--dragging :global(.sortable-list-handle) {
			color: var(--color-text);
			cursor: grabbing;
		}

		.sortable-list-status {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		@media (forced-colors: active) {
			.sortable-list-item--dragging {
				outline: 2px solid Highlight;
			}

			.sortable-list-handle:focus-visible {
				outline-color: Highlight;
			}
		}
	}
</style>

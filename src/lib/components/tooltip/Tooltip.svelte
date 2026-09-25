<script module lang="ts">
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';

	export type TooltipTriggerProps = {
		onpointerenter: (event: PointerEvent) => void;
		onpointerleave: () => void;
		onpointerdown: () => void;
		onfocus: () => void;
		onblur: () => void;
		'aria-describedby': string | undefined;
		[key: symbol]: Attachment<HTMLElement>;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Side = 'top' | 'right' | 'bottom' | 'left';

	type Props = {
		/** Whether the tooltip is shown. Bindable. */
		open?: boolean;
		/** Preferred side; flips to the opposite one when there is not enough room. */
		side?: Side;
		/** Milliseconds to wait on hover before showing. Focus shows immediately. */
		delay?: number;
		/** Renders the trigger. Spread the given props onto it, e.g. `<Button {...props} />`. */
		trigger: Snippet<[TooltipTriggerProps]>;
		/** Tooltip content; may contain `Kbd` / `KbdGroup`. */
		children: Snippet;
	};

	let { open = $bindable(false), side = 'top', delay = 0, trigger, children }: Props = $props();

	const id = $props.id();
	const gap = 6;
	const edge = 8;
	const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;

	let triggerEl: HTMLElement | undefined;
	let placement: Side = $state('top');
	let position = $state({ top: 0, left: 0, arrow: 0 });
	let timer: ReturnType<typeof setTimeout> | undefined;
	// A click dismisses the tooltip until the pointer leaves the trigger.
	let pressed = false;

	function show(wait: number) {
		clearTimeout(timer);
		if (pressed) return;
		if (wait > 0) timer = setTimeout(() => (open = true), wait);
		else open = true;
	}

	function hide() {
		clearTimeout(timer);
		open = false;
	}

	const triggerProps: TooltipTriggerProps = $derived({
		onpointerenter: (event: PointerEvent) => {
			if (event.pointerType !== 'touch') show(delay);
		},
		onpointerleave: () => {
			pressed = false;
			hide();
		},
		onpointerdown: () => {
			pressed = true;
			hide();
		},
		onfocus: () => {
			if (triggerEl?.matches(':focus-visible')) show(0);
		},
		onblur: hide,
		'aria-describedby': open ? `${id}-tooltip` : undefined,
		[createAttachmentKey()]: (node: HTMLElement) => {
			triggerEl = node;
			return () => clearTimeout(timer);
		}
	});

	function fits(rect: DOMRect, width: number, height: number, s: Side) {
		if (s === 'top') return rect.top - gap - height >= edge;
		if (s === 'bottom') return rect.bottom + gap + height <= window.innerHeight - edge;
		if (s === 'left') return rect.left - gap - width >= edge;
		return rect.right + gap + width <= window.innerWidth - edge;
	}

	function place(node: HTMLElement) {
		if (!triggerEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const { offsetWidth: width, offsetHeight: height } = node;
		const s =
			fits(rect, width, height, side) || !fits(rect, width, height, opposite[side])
				? side
				: opposite[side];
		const clamp = (value: number, max: number) => Math.min(Math.max(value, edge), max - edge);

		if (s === 'top' || s === 'bottom') {
			const center = rect.left + rect.width / 2;
			const left = clamp(center - width / 2, window.innerWidth - width);
			const top = s === 'top' ? rect.top - gap - height : rect.bottom + gap;
			position = { top, left, arrow: center - left };
		} else {
			const center = rect.top + rect.height / 2;
			const top = clamp(center - height / 2, window.innerHeight - height);
			const left = s === 'left' ? rect.left - gap - width : rect.right + gap;
			position = { top, left, arrow: center - top };
		}
		placement = s;
	}

	const popover: Attachment<HTMLDivElement> = (node) => {
		node.showPopover();
		place(node);
	};

	$effect(() => {
		if (!open) return;

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') hide();
		}

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('scroll', hide, true);
		window.addEventListener('resize', hide);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('scroll', hide, true);
			window.removeEventListener('resize', hide);
		};
	});
</script>

<span class="tooltip">
	{@render trigger(triggerProps)}

	{#if open}
		<div
			id="{id}-tooltip"
			role="tooltip"
			popover="manual"
			class={['tooltip-content', `tooltip-content--${placement}`]}
			style:top="{position.top}px"
			style:left="{position.left}px"
			style:--tooltip-arrow="{position.arrow}px"
			{@attach popover}
			transition:fade={{ duration: 100 }}
		>
			{@render children()}
			<span class="tooltip-arrow" aria-hidden="true"></span>
		</div>
	{/if}
</span>

<style>
	.tooltip {
		display: inline-flex;
		height: fit-content;
	}

	.tooltip-content {
		position: fixed;
		inset: auto;
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		width: max-content;
		max-width: 280px;
		padding: 6px 10px;
		overflow: visible;
		font-size: 12px;
		line-height: 1.4;
		text-wrap: balance;
		background-color: var(--color-ink);
		color: var(--color-base);
		border: none;
		border-radius: 10px;
		pointer-events: none;
	}

	.tooltip-content :global(:is(.kbd, .kbd-group)) {
		font-size: inherit;
	}

	.tooltip-arrow {
		position: absolute;
		width: 8px;
		height: 8px;
		background-color: inherit;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.tooltip-content--top .tooltip-arrow,
	.tooltip-content--bottom .tooltip-arrow {
		left: calc(var(--tooltip-arrow) - 4px);
	}

	.tooltip-content--left .tooltip-arrow,
	.tooltip-content--right .tooltip-arrow {
		top: calc(var(--tooltip-arrow) - 4px);
	}

	.tooltip-content--top .tooltip-arrow {
		bottom: -3px;
	}

	.tooltip-content--bottom .tooltip-arrow {
		top: -3px;
	}

	.tooltip-content--left .tooltip-arrow {
		right: -3px;
	}

	.tooltip-content--right .tooltip-arrow {
		left: -3px;
	}
</style>

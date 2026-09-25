<script module lang="ts">
	import { createAttachmentKey, type Attachment } from 'svelte/attachments';

	export type PopoverTriggerProps = {
		onclick?: () => void;
		onpointerenter?: (event: PointerEvent) => void;
		onpointerleave?: () => void;
		onfocus?: () => void;
		onblur?: (event: FocusEvent) => void;
		'aria-haspopup'?: 'dialog';
		'aria-expanded'?: boolean;
		'aria-controls'?: string;
		[key: symbol]: Attachment<HTMLElement>;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';

	type Side = 'top' | 'right' | 'bottom' | 'left';

	type Props = {
		/** Whether the popover is open. Bindable. */
		open?: boolean;
		/** Opens on hover and keyboard focus instead of on click, like a hover card. */
		hover?: boolean;
		/** Milliseconds to wait on hover before opening. Only used with `hover`. */
		delay?: number;
		/** Preferred side; flips to the opposite one when there is not enough room. */
		side?: Side;
		/** Alignment along the trigger's edge. */
		align?: 'start' | 'center' | 'end';
		title?: string;
		description?: string;
		/** Renders the trigger. Spread the given props onto it, e.g. `<Button {...props} />`. */
		trigger: Snippet<[PopoverTriggerProps]>;
		children?: Snippet;
	};

	let {
		open = $bindable(false),
		hover = false,
		delay = 500,
		side = 'bottom',
		align = 'center',
		title,
		description,
		trigger,
		children
	}: Props = $props();

	const id = $props.id();
	const gap = 8;
	const edge = 8;
	const closeDelay = 200;
	const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;

	let wrapperEl: HTMLSpanElement;
	let triggerEl: HTMLElement | undefined;
	let contentEl: HTMLDivElement | undefined = $state();
	let placement: Side = $state('bottom');
	let position = $state({ top: 0, left: 0 });
	let timer: ReturnType<typeof setTimeout> | undefined;

	function schedule(value: boolean, wait: number) {
		clearTimeout(timer);
		if (wait > 0) timer = setTimeout(() => (open = value), wait);
		else open = value;
	}

	function close({ restoreFocus = false } = {}) {
		clearTimeout(timer);
		open = false;
		if (restoreFocus) triggerEl?.focus();
	}

	function leftWrapper(event: FocusEvent) {
		return !wrapperEl.contains(event.relatedTarget as Node | null);
	}

	const attach = createAttachmentKey();

	const triggerProps: PopoverTriggerProps = $derived.by(() => {
		const ref = (node: HTMLElement) => {
			triggerEl = node;
			return () => clearTimeout(timer);
		};

		if (hover) {
			return {
				onpointerenter: (event: PointerEvent) => {
					if (event.pointerType !== 'touch') schedule(true, delay);
				},
				onpointerleave: () => schedule(false, closeDelay),
				onfocus: () => {
					if (triggerEl?.matches(':focus-visible')) schedule(true, 0);
				},
				onblur: (event: FocusEvent) => {
					if (leftWrapper(event)) close();
				},
				[attach]: ref
			};
		}

		return {
			onclick: () => (open ? close() : (open = true)),
			'aria-haspopup': 'dialog',
			'aria-expanded': open,
			'aria-controls': `${id}-popover`,
			[attach]: ref
		};
	});

	function fits(rect: DOMRect, width: number, height: number, s: Side) {
		if (s === 'top') return rect.top - gap - height >= edge;
		if (s === 'bottom') return rect.bottom + gap + height <= window.innerHeight - edge;
		if (s === 'left') return rect.left - gap - width >= edge;
		return rect.right + gap + width <= window.innerWidth - edge;
	}

	function aligned(start: number, length: number, size: number) {
		if (align === 'start') return start;
		if (align === 'end') return start + length - size;
		return start + length / 2 - size / 2;
	}

	function place() {
		if (!triggerEl || !contentEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const { offsetWidth: width, offsetHeight: height } = contentEl;
		const s =
			fits(rect, width, height, side) || !fits(rect, width, height, opposite[side])
				? side
				: opposite[side];
		const clamp = (value: number, max: number) => Math.min(Math.max(value, edge), max - edge);

		if (s === 'top' || s === 'bottom') {
			position = {
				top: s === 'top' ? rect.top - gap - height : rect.bottom + gap,
				left: clamp(aligned(rect.left, rect.width, width), window.innerWidth - width)
			};
		} else {
			position = {
				top: clamp(aligned(rect.top, rect.height, height), window.innerHeight - height),
				left: s === 'left' ? rect.left - gap - width : rect.right + gap
			};
		}
		placement = s;
	}

	const popover: Attachment<HTMLDivElement> = (node) => {
		node.showPopover();
		place();
		if (!hover) {
			const first = node.querySelector<HTMLElement>(
				'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
			);
			(first ?? node).focus();
		}
	};

	$effect(() => {
		if (!open) return;

		function handlePointerDown(event: PointerEvent) {
			if (!hover && !wrapperEl.contains(event.target as Node)) close();
		}

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') close({ restoreFocus: !hover });
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

<span class="popover" bind:this={wrapperEl}>
	{@render trigger(triggerProps)}

	{#if open}
		<div
			id="{id}-popover"
			role={hover ? undefined : 'dialog'}
			aria-labelledby={title ? `${id}-title` : undefined}
			aria-describedby={description ? `${id}-description` : undefined}
			tabindex="-1"
			popover="manual"
			class={['popover-content', `popover-content--${placement}`, `popover-content--${align}`]}
			style:top="{position.top}px"
			style:left="{position.left}px"
			bind:this={contentEl}
			onpointerenter={() => hover && clearTimeout(timer)}
			onpointerleave={() => hover && schedule(false, closeDelay)}
			onfocusout={(event) => {
				if (leftWrapper(event)) close();
			}}
			{@attach popover}
			transition:scale={{ duration: 140, start: 0.95 }}
		>
			{#if title}
				<h3 id="{id}-title" class="popover-title">{title}</h3>
			{/if}
			{#if description}
				<p id="{id}-description" class="popover-description">{description}</p>
			{/if}
			{#if children}
				<div class="popover-body">{@render children()}</div>
			{/if}
		</div>
	{/if}
</span>

<style>
	.popover {
		display: inline-flex;
		height: fit-content;
	}

	.popover-content {
		position: fixed;
		inset: auto;
		box-sizing: border-box;
		width: 288px;
		max-width: calc(100vw - 16px);
		margin: 0;
		padding: 16px;
		overflow: visible;
		font-size: 13px;
		line-height: 1.5;
		background-color: var(--color-bg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		outline: none;
	}

	.popover-title {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
	}

	.popover-description {
		margin: 4px 0 0;
		color: var(--color-text-muted);
	}

	:is(.popover-title, .popover-description) + .popover-body {
		margin-top: 14px;
	}

	.popover-content--bottom {
		transform-origin: top center;
	}

	.popover-content--top {
		transform-origin: bottom center;
	}

	.popover-content--left {
		transform-origin: center right;
	}

	.popover-content--right {
		transform-origin: center left;
	}

	.popover-content--bottom.popover-content--start {
		transform-origin: top left;
	}

	.popover-content--bottom.popover-content--end {
		transform-origin: top right;
	}

	.popover-content--top.popover-content--start {
		transform-origin: bottom left;
	}

	.popover-content--top.popover-content--end {
		transform-origin: bottom right;
	}
</style>

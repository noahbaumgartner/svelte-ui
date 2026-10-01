<script lang="ts" module>
	export type SelectOption<T extends string | number | null = string> = {
		value: T;
		label: string;
		disabled?: boolean;
	};
</script>

<script lang="ts" generics="T extends string | number | null">
	import { tick, type Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { Check, ChevronsUpDown } from '@lucide/svelte';

	type Props = Omit<
		HTMLButtonAttributes,
		'value' | 'children' | 'onchange' | 'type' | 'role' | 'name'
	> & {
		/** Value of the chosen option. Bindable. */
		value?: T;
		options: SelectOption<T>[];
		/** Shown while no option is chosen. */
		placeholder?: string;
		/** Form field name; submits the value through a hidden input. */
		name?: string;
		onchange?: (value: T) => void;
		/** Text shown in the list when there are no options. */
		labels?: { empty?: string };
		/** Replaces the content of each option. */
		option?: Snippet<[option: SelectOption<T>, selected: boolean]>;
		/** The trigger button. */
		ref?: HTMLButtonElement | null;
	};

	let {
		value = $bindable(),
		options,
		placeholder = 'Select',
		name,
		disabled = false,
		ref = $bindable(null),
		class: className,
		onchange,
		labels,
		option: optionContent,
		...rest
	}: Props = $props();

	const id = $props.id();
	const gap = 4;
	const edge = 8;
	const maxHeight = 320;

	let open = $state(false);
	let wrapperEl: HTMLSpanElement;
	let triggerEl: HTMLButtonElement;
	const emptyLabel = $derived(labels?.empty ?? 'No options');
	let listEl: HTMLDivElement | undefined = $state();
	let placement: 'top' | 'bottom' = $state('bottom');
	let position: { top?: number; bottom?: number; left: number; width: number; height: number } =
		$state({ left: 0, width: 0, height: maxHeight });

	let current = $derived(options.find((option) => option.value === value));

	function reducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function items() {
		return Array.from(
			listEl?.querySelectorAll<HTMLElement>('[role="option"]:not(:disabled)') ?? []
		);
	}

	async function show(focus: 'first' | 'last' = 'first') {
		open = true;
		await tick();
		const list = items();
		const selected = list.find((item) => item.getAttribute('aria-selected') === 'true');
		(selected ?? (focus === 'first' ? list[0] : list.at(-1)))?.focus();
	}

	function close({ restoreFocus = false } = {}) {
		open = false;
		if (restoreFocus) triggerEl.focus();
	}

	function choose(option: SelectOption<T>) {
		value = option.value;
		onchange?.(option.value);
		close({ restoreFocus: true });
	}

	/* The list sits in the top layer so dialogs and scroll containers cannot clip it */
	function place() {
		if (!listEl) return;
		const rect = triggerEl.getBoundingClientRect();
		const below = window.innerHeight - rect.bottom - gap - edge;
		const above = rect.top - gap - edge;
		const wanted = Math.min(listEl.scrollHeight + 2, maxHeight);
		placement = below < wanted && above > below ? 'top' : 'bottom';
		const left = Math.max(edge, Math.min(rect.left, window.innerWidth - listEl.offsetWidth - edge));
		position =
			placement === 'top'
				? {
						bottom: window.innerHeight - rect.top + gap,
						left,
						width: rect.width,
						height: Math.min(maxHeight, above)
					}
				: { top: rect.bottom + gap, left, width: rect.width, height: Math.min(maxHeight, below) };
	}

	const popover: Attachment<HTMLDivElement> = (node) => {
		node.showPopover();
		place();
	};

	/* Typing jumps to the option that starts with the typed letters */
	let typed = '';
	let typedTimer: ReturnType<typeof setTimeout> | undefined;

	function typeahead(key: string) {
		clearTimeout(typedTimer);
		typed += key.toLowerCase();
		typedTimer = setTimeout(() => (typed = ''), 500);
		items()
			.find((item) => item.textContent?.trim().toLowerCase().startsWith(typed))
			?.focus();
	}

	function handleListKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			// Only the list closes, not a Dialog or Drawer around it
			event.preventDefault();
			event.stopPropagation();
			close({ restoreFocus: true });
			return;
		}
		if (event.key === 'Tab') {
			event.preventDefault();
			close({ restoreFocus: true });
			return;
		}

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
		} else if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey) {
			typeahead(event.key);
		}
	}

	$effect(() => {
		if (!open) return;

		function handlePointerDown(event: PointerEvent) {
			if (!wrapperEl.contains(event.target as Node)) close();
		}

		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('scroll', place, true);
		window.addEventListener('resize', place);

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('scroll', place, true);
			window.removeEventListener('resize', place);
		};
	});
</script>

<span class={['select', className]} bind:this={wrapperEl}>
	<button
		{...rest}
		bind:this={triggerEl}
		{@attach (node) => {
			ref = node;
			return () => {
				if (ref === node) ref = null;
			};
		}}
		type="button"
		role="combobox"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls="{id}-listbox"
		{disabled}
		class="select-trigger"
		onclick={(event) => {
			rest.onclick?.(event);
			if (open) close();
			else show();
		}}
		onkeydown={(event) => {
			rest.onkeydown?.(event);
			if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
			event.preventDefault();
			show(event.key === 'ArrowDown' ? 'first' : 'last');
		}}
	>
		<span class={['select-value', { 'select-value--placeholder': !current }]}>
			{current?.label ?? placeholder}
		</span>
		<ChevronsUpDown class="select-chevron" aria-hidden="true" />
	</button>
	{#if name}<input type="hidden" {name} value={value ?? ''} />{/if}

	{#if open}
		<div
			id="{id}-listbox"
			role="listbox"
			tabindex="-1"
			popover="manual"
			class={['select-list', `select-list--${placement}`]}
			style:top={position.top === undefined ? undefined : `${position.top}px`}
			style:bottom={position.bottom === undefined ? undefined : `${position.bottom}px`}
			style:left="{position.left}px"
			style:min-width="{position.width}px"
			style:max-height="{position.height}px"
			bind:this={listEl}
			onkeydown={handleListKeydown}
			onfocusout={(event) => {
				if (!wrapperEl.contains(event.relatedTarget as Node | null)) close();
			}}
			{@attach popover}
			transition:scale={{ duration: reducedMotion() ? 0 : 140, start: 0.95 }}
		>
			{#each options as option (option.value)}
				{@const selected = option.value === value}
				<button
					type="button"
					role="option"
					tabindex="-1"
					aria-selected={selected}
					disabled={option.disabled}
					class={['select-option', { 'select-option--selected': selected }]}
					onclick={() => choose(option)}
				>
					{#if optionContent}
						<span class="select-option-label">{@render optionContent(option, selected)}</span>
					{:else}
						<span class="select-option-label">{option.label}</span>
					{/if}
					<span class="select-option-check">
						{#if selected}<Check aria-hidden="true" />{/if}
					</span>
				</button>
			{:else}
				<div class="select-empty">{emptyLabel}</div>
			{/each}
		</div>
	{/if}
</span>

<style>
	@layer svelte-ui {
		.select {
			display: flex;
			width: 100%;
			min-width: 0;
		}

		/* Looks like an Input */
		.select-trigger {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
			box-sizing: border-box;
			width: 100%;
			min-width: 0;
			height: 32px;
			padding: 0 8px 0 10px;
			font-family: inherit;
			font-size: 13px;
			color: var(--color-text);
			text-align: left;
			background-color: transparent;
			border: 1px solid var(--color-border-strong);
			border-radius: 10px;
			outline: none;
			cursor: pointer;
			transition: border-color 200ms ease;
		}

		.select-trigger:focus-visible,
		.select-trigger[aria-expanded='true'] {
			border-color: var(--color-accent);
			outline: 1px solid var(--color-accent);
		}

		.select-trigger[aria-invalid='true'] {
			border-color: var(--color-destructive);
		}

		.select-trigger[aria-invalid='true']:is(:focus-visible, [aria-expanded='true']) {
			outline-color: var(--color-destructive);
		}

		.select-trigger:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		.select-value {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.select-value--placeholder {
			color: var(--color-text-faint);
		}

		.select-trigger :global(.select-chevron) {
			width: 14px;
			height: 14px;
			flex-shrink: 0;
			color: var(--color-text-muted);
		}

		.select-list {
			position: fixed;
			inset: auto;
			flex-direction: column;
			gap: 2px;
			box-sizing: border-box;
			max-width: calc(100vw - 16px);
			margin: 0;
			padding: 4px;
			overflow-y: auto;
			overscroll-behavior: contain;
			background-color: var(--color-bg);
			color: var(--color-text);
			border: 1px solid var(--color-border);
			border-radius: 10px;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
			outline: none;
			user-select: none;
		}

		.select-list:popover-open {
			display: flex;
		}

		.select-list--bottom {
			transform-origin: top left;
		}

		.select-list--top {
			transform-origin: bottom left;
		}

		.select-option {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			gap: 10px;
			width: 100%;
			padding: 8px 10px;
			font: inherit;
			font-size: 13px;
			color: var(--color-text);
			text-align: left;
			background-color: transparent;
			border: none;
			border-radius: 6px;
			outline: none;
			cursor: pointer;
			transition: background-color 150ms ease;
		}

		/* Plain :focus, so the current option also shows after opening with the mouse */
		.select-option:hover:not(:disabled),
		.select-option:focus {
			background-color: var(--color-surface);
		}

		.select-option:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		.select-option--selected {
			font-weight: 600;
		}

		.select-option-label {
			flex-grow: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.select-option-check {
			display: flex;
			width: 14px;
			height: 14px;
			flex-shrink: 0;
		}

		.select-option-check :global(svg) {
			width: 14px;
			height: 14px;
		}

		.select-empty {
			padding: 8px 10px;
			font-size: 13px;
			color: var(--color-text-muted);
		}

		@media (pointer: coarse) {
			.select-trigger {
				min-height: 44px;
			}

			.select-option {
				min-height: 44px;
			}
		}

		@media (forced-colors: active) {
			.select-trigger {
				border-color: ButtonText;
			}

			.select-trigger:disabled {
				border-color: GrayText;
				color: GrayText;
			}

			.select-trigger:focus-visible,
			.select-trigger[aria-expanded='true'] {
				border-color: Highlight;
				outline: 2px solid Highlight;
			}

			.select-list {
				border-color: CanvasText;
			}

			.select-option:hover:not(:disabled),
			.select-option:focus {
				outline: 2px solid Highlight;
				outline-offset: -2px;
			}

			.select-option:disabled {
				color: GrayText;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.select-trigger,
			.select-option {
				transition: none;
			}
		}
	}
</style>

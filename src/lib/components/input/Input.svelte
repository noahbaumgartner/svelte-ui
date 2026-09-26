<script lang="ts" module>
	/** Checkbox and radio have their own components; buttons are Button; range and hidden are not text fields. */
	export type InputType =
		| 'text'
		| 'email'
		| 'password'
		| 'tel'
		| 'url'
		| 'search'
		| 'number'
		| 'date'
		| 'time'
		| 'datetime-local'
		| 'month'
		| 'week'
		| 'color'
		| 'file';
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Calendar as CalendarIcon, ChevronDown, ChevronUp, Clock } from '@lucide/svelte';
	import Calendar from '../calendar/Calendar.svelte';
	import ColorPicker from '../color-picker/ColorPicker.svelte';
	import TimePicker from '../time-picker/TimePicker.svelte';
	import { formatDate } from '../calendar/dates.js';

	type Props = Omit<HTMLInputAttributes, 'type'> & {
		/** Number gets a stepper; date, time and color types open this library's pickers. */
		type?: InputType;
	};

	let {
		value = $bindable(),
		type = 'text',
		class: className,
		style,
		disabled,
		readonly,
		...rest
	}: Props = $props();

	const pickers = ['date', 'time', 'datetime-local', 'month', 'week'];

	const id = $props.id();
	let input: HTMLInputElement | undefined = $state();
	let wrapperEl: HTMLElement | undefined = $state();
	let popoverEl: HTMLElement | undefined = $state();
	let open = $state(false);
	let side: 'top' | 'bottom' = $state('bottom');

	let picker = $derived(pickers.includes(type));
	let inactive = $derived(disabled || readonly);
	let text = $derived(String(value ?? ''));
	let minuteStep = $derived(Math.max(1, Math.round(Number(rest.step) / 60) || 1));

	/* Updates the native input and fires the events typing would, so bind:value and handlers follow */
	function set(next: string) {
		if (!input) return;
		input.value = next;
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function step(direction: 1 | -1) {
		if (!input) return;
		if (direction === 1) input.stepUp();
		else input.stepDown();
		set(input.value);
		input.focus();
	}

	async function show() {
		open = true;
		await tick();
		popoverEl?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
	}

	function close(restoreFocus = false) {
		open = false;
		if (restoreFocus) input?.focus();
	}

	function toggle() {
		if (open) close(true);
		else show();
	}

	function handleColorClick(event: MouseEvent & { currentTarget: HTMLInputElement }) {
		rest.onclick?.(event);
		event.preventDefault();
		if (!inactive) toggle();
	}

	$effect(() => {
		if (!open) return;

		tick().then(() => {
			if (!popoverEl || !wrapperEl) return;
			const rect = wrapperEl.getBoundingClientRect();
			const height = popoverEl.offsetHeight;
			side =
				window.innerHeight - rect.bottom < height + 8 && rect.top > height + 8 ? 'top' : 'bottom';
		});

		function handlePointerDown(event: PointerEvent) {
			if (!wrapperEl?.contains(event.target as Node)) close();
		}

		function handleKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') close(true);
		}

		function handleFocusIn(event: FocusEvent) {
			if (!wrapperEl?.contains(event.target as Node)) close();
		}

		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('focusin', handleFocusIn);

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('focusin', handleFocusIn);
		};
	});
</script>

{#if type === 'number' || picker || type === 'color'}
	<span
		class={['input-wrapper', { 'input-wrapper--color': type === 'color' }, className]}
		{style}
		bind:this={wrapperEl}
	>
		<input
			{...rest}
			{type}
			bind:value
			bind:this={input}
			{disabled}
			{readonly}
			class={['input', { 'input--with-controls': type !== 'color' }]}
			onclick={type === 'color' ? handleColorClick : rest.onclick}
			aria-haspopup={type === 'color' ? 'dialog' : undefined}
			aria-expanded={type === 'color' ? open : undefined}
		/>
		{#if type !== 'color'}
			<span class="input-controls">
				{#if type === 'number'}
					<button
						type="button"
						tabindex="-1"
						aria-label="Increase"
						disabled={inactive}
						onclick={() => step(1)}
					>
						<ChevronUp aria-hidden="true" />
					</button>
					<button
						type="button"
						tabindex="-1"
						aria-label="Decrease"
						disabled={inactive}
						onclick={() => step(-1)}
					>
						<ChevronDown aria-hidden="true" />
					</button>
				{:else}
					{@const Icon = type === 'time' ? Clock : CalendarIcon}
					<button
						type="button"
						aria-label={type === 'time' ? 'Choose time' : 'Choose date'}
						aria-haspopup="dialog"
						aria-expanded={open}
						aria-controls="{id}-picker"
						disabled={inactive}
						onclick={toggle}
					>
						<Icon aria-hidden="true" />
					</button>
				{/if}
			</span>
		{/if}

		{#if open}
			<div
				id="{id}-picker"
				role="dialog"
				aria-label={type === 'color'
					? 'Choose color'
					: type === 'time'
						? 'Choose time'
						: 'Choose date'}
				class={['input-popover', `input-popover--${side}`]}
				bind:this={popoverEl}
				transition:scale={{ duration: 140, start: 0.95 }}
			>
				{#if type === 'date' || type === 'week' || type === 'month'}
					<Calendar
						mode={type}
						value={text}
						min={rest.min?.toString()}
						max={rest.max?.toString()}
						onselect={(next) => {
							set(next);
							close(true);
						}}
					/>
				{:else if type === 'time'}
					<TimePicker value={text.slice(0, 5)} {minuteStep} onselect={set} />
				{:else if type === 'datetime-local'}
					{@const date = text.slice(0, 10)}
					{@const time = text.slice(11, 16)}
					<Calendar
						value={date}
						min={rest.min?.toString().slice(0, 10)}
						max={rest.max?.toString().slice(0, 10)}
						onselect={(next) => set(`${next}T${time || '00:00'}`)}
					/>
					<TimePicker
						value={time}
						{minuteStep}
						onselect={(next) => set(`${date || formatDate(new Date())}T${next}`)}
					/>
				{:else if type === 'color'}
					<ColorPicker value={text || '#000000'} onselect={set} />
				{/if}
			</div>
		{/if}
	</span>
{:else}
	<input {...rest} {type} bind:value {disabled} {readonly} {style} class={['input', className]} />
{/if}

<style>
	.input {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		height: 32px;
		padding: 0 10px;
		font-family: inherit;
		font-size: 13px;
		color: var(--color-text);
		background-color: transparent;
		border: 1px solid var(--color-border-strong);
		border-radius: 10px;
		outline: none;
		transition: border-color 200ms ease;
	}

	.input::selection {
		color: var(--color-accent-foreground);
		background-color: var(--color-accent);
	}

	.input[type='file'] {
		padding: 0 10px 0 4px;
		color: var(--color-text-muted);
		cursor: pointer;
	}

	.input::file-selector-button {
		height: 24px;
		margin: 3px 8px 0 0;
		padding: 0 8px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text);
		background-color: var(--color-surface);
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.input[type='search'] {
		padding-right: 4px;
	}

	/* Native clear button as a ghost button with a gradient X */
	.input::-webkit-search-cancel-button {
		appearance: none;
		width: 24px;
		height: 24px;
		margin: 0;
		border-radius: 6px;
		background:
			linear-gradient(45deg, transparent 46%, var(--color-text) 46% 54%, transparent 54%),
			linear-gradient(-45deg, transparent 46%, var(--color-text) 46% 54%, transparent 54%),
			transparent;
		background-size:
			10px 10px,
			10px 10px,
			auto;
		background-position: center;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	.input::-webkit-search-cancel-button:hover {
		background-color: var(--color-surface);
	}

	.input[type='color'] {
		width: 64px;
		padding: 3px;
		cursor: pointer;
	}

	.input::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	.input::-webkit-color-swatch {
		border: none;
		border-radius: 6px;
	}

	.input::-moz-color-swatch {
		border: none;
		border-radius: 6px;
	}

	/* Number and date/time types: custom buttons replace the native spinners and picker icon */
	.input-wrapper {
		position: relative;
		display: flex;
		width: 100%;
		min-width: 0;
	}

	.input-wrapper--color {
		width: fit-content;
	}

	.input-popover {
		position: absolute;
		left: 0;
		z-index: 60;
		display: flex;
		gap: 12px;
		padding: 12px;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 14px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.input-popover--bottom {
		top: calc(100% + 8px);
		transform-origin: top left;
	}

	.input-popover--top {
		bottom: calc(100% + 8px);
		transform-origin: bottom left;
	}

	.input--with-controls {
		padding-right: 32px;
	}

	.input[type='number'] {
		appearance: textfield;
	}

	.input::-webkit-inner-spin-button,
	.input::-webkit-outer-spin-button,
	.input::-webkit-calendar-picker-indicator {
		display: none;
		appearance: none;
		margin: 0;
	}

	.input::-webkit-datetime-edit-fields-wrapper {
		padding: 0;
	}

	.input::-webkit-datetime-edit-text {
		color: var(--color-text-muted);
	}

	.input-controls {
		position: absolute;
		top: 4px;
		right: 4px;
		bottom: 4px;
		display: flex;
		flex-direction: column;
	}

	.input-controls button {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		width: 24px;
		padding: 0;
		color: var(--color-text-muted);
		background-color: transparent;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition:
			background-color 200ms ease,
			color 200ms ease;
	}

	.input-controls button:hover:not(:disabled) {
		color: var(--color-text);
		background-color: var(--color-surface);
	}

	.input-controls button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.input-controls :global(svg) {
		width: 14px;
		height: 14px;
	}

	/* Two stacked stepper buttons are half height */
	.input-controls button:not(:only-child) {
		border-radius: 4px;
	}

	.input-controls button:not(:only-child) :global(svg) {
		width: 12px;
		height: 12px;
	}

	.input::placeholder {
		color: var(--color-text-faint);
	}

	.input:focus-visible {
		border-color: var(--color-accent);
		outline: 1px solid var(--color-accent);
	}

	.input[aria-invalid='true'] {
		border-color: var(--color-destructive);
	}

	.input[aria-invalid='true']:focus-visible {
		outline-color: var(--color-destructive);
	}

	.input:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>

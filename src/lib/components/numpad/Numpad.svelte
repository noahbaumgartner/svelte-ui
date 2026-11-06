<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Delete from '../../internal/icons/Delete.svelte';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> & {
		/** The typed digits, e.g. `"12.5"`. */
		value?: string;
		/** Shows a decimal key; the value then allows at most `decimals` digits after it. */
		decimals?: number;
		/** Maximum number of characters. */
		maxLength?: number;
		/** Character of the decimal key. */
		separator?: '.' | ',';
		disabled?: boolean;
		/** Accessible name of the keypad. */
		label?: string;
		labels?: { delete?: string };
		onchange?: (value: string) => void;
		ref?: HTMLDivElement | null;
	};

	let {
		value = $bindable(''),
		decimals = 0,
		maxLength = 10,
		separator = '.',
		disabled = false,
		label = 'Keypad',
		labels,
		onchange,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	function set(next: string) {
		value = next;
		onchange?.(next);
	}

	function press(key: string) {
		if (value.length >= maxLength) return;
		const [, fraction] = value.split(separator);
		if (key === separator) {
			if (decimals === 0 || value.includes(separator)) return;
			set((value || '0') + separator);
			return;
		}
		if (fraction !== undefined && fraction.length >= decimals) return;
		// No leading zeros: "0" then "5" becomes "5".
		set(value === '0' ? key : value + key);
	}

	function remove() {
		set(value.slice(0, -1));
	}
</script>

<div {...rest} bind:this={ref} role="group" aria-label={label} class={['numpad', className]}>
	{#each digits as digit (digit)}
		<button type="button" class="numpad-key" {disabled} onclick={() => press(digit)}>{digit}</button
		>
	{/each}
	{#if decimals > 0}
		<button type="button" class="numpad-key" {disabled} onclick={() => press(separator)}
			>{separator}</button
		>
	{:else}
		<span aria-hidden="true"></span>
	{/if}
	<button type="button" class="numpad-key" {disabled} onclick={() => press('0')}>0</button>
	<button
		type="button"
		class="numpad-key numpad-key--action"
		aria-label={labels?.delete ?? 'Delete'}
		disabled={disabled || value.length === 0}
		onclick={remove}
	>
		<Delete aria-hidden="true" />
	</button>
</div>

<style>
	@layer svelte-ui {
		.numpad {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 8px;
		}

		.numpad-key {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-height: 56px;
			padding: 0;
			border: 1px solid var(--color-border);
			border-radius: 10px;
			background-color: var(--color-bg);
			color: var(--color-text);
			font: inherit;
			font-size: 22px;
			font-variant-numeric: tabular-nums;
			cursor: pointer;
			touch-action: manipulation;
			user-select: none;
			transition: background-color 120ms ease;
		}

		.numpad-key:hover:not(:disabled) {
			background-color: var(--color-surface);
		}

		.numpad-key:active:not(:disabled) {
			background-color: var(--color-surface-active);
		}

		.numpad-key:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		.numpad-key:disabled {
			color: var(--color-text-faint);
			cursor: not-allowed;
		}

		.numpad-key--action {
			background-color: var(--color-surface);
		}

		.numpad-key :global(svg) {
			width: 22px;
			height: 22px;
		}

		@media (prefers-reduced-motion: reduce) {
			.numpad-key {
				transition: none;
			}
		}

		@media (forced-colors: active) {
			.numpad-key {
				border-color: ButtonText;
			}
		}
	}
</style>

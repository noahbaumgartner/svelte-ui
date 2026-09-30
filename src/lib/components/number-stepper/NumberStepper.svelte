<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Minus, Plus } from '@lucide/svelte';
	import Button from '../button/Button.svelte';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> & {
		/** The count. Bindable. */
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		/** Names what is counted; the accessible name of the group and part of the button labels. */
		label: string;
		onchange?: (value: number) => void;
	};

	let {
		value = $bindable(0),
		min = 0,
		max = Infinity,
		step = 1,
		size = 'sm',
		disabled = false,
		label,
		class: className,
		onchange,
		...rest
	}: Props = $props();

	function set(next: number) {
		value = Math.min(Math.max(next, min), max);
		onchange?.(value);
	}
</script>

<div
	{...rest}
	role="group"
	aria-label={label}
	class={['number-stepper', `number-stepper--${size}`, className]}
>
	<Button
		variant="outline"
		{size}
		icon={Minus}
		label="Decrease {label}"
		disabled={disabled || value <= min}
		onclick={() => set(value - step)}
	/>
	<output class="number-stepper-value" aria-live="polite">{value}</output>
	<Button
		variant="outline"
		{size}
		icon={Plus}
		label="Increase {label}"
		disabled={disabled || value >= max}
		onclick={() => set(value + step)}
	/>
</div>

<style>
	.number-stepper {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 13px;
		color: var(--color-text);
	}

	.number-stepper--sm {
		font-size: 12px;
	}

	.number-stepper-value {
		min-width: 24px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: center;
	}
</style>

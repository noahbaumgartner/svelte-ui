<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setRadioGroupContext } from './context.js';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Value of the selected RadioGroupItem. */
		value?: string;
		/** Form field name. Generated when omitted. */
		name?: string;
		disabled?: boolean;
		required?: boolean;
		orientation?: 'vertical' | 'horizontal';
		/** Horizontal Fields, each with a RadioGroupItem and a Label. */
		children: Snippet;
	};

	let {
		value = $bindable(),
		name,
		disabled = false,
		required = false,
		orientation = 'vertical',
		class: className,
		children,
		...rest
	}: Props = $props();

	const fallbackName = $props.id();

	setRadioGroupContext({
		get name() {
			return name ?? fallbackName;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		get required() {
			return required;
		},
		select: (next) => {
			value = next;
		}
	});
</script>

<div
	{...rest}
	role="radiogroup"
	aria-disabled={disabled || undefined}
	aria-required={required || undefined}
	aria-orientation={orientation}
	class={['radio-group', `radio-group--${orientation}`, className]}
>
	{@render children()}
</div>

<style>
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.radio-group--horizontal {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 12px 24px;
	}

	.radio-group--horizontal > :global(.field) {
		width: auto;
	}

	/* aria-invalid is not allowed on a radio, so the group carries it */
	.radio-group[aria-invalid='true'] :global(.radio input) {
		border-color: var(--color-destructive);
	}

	.radio-group[aria-invalid='true'] :global(.label) {
		color: var(--color-destructive);
	}
</style>

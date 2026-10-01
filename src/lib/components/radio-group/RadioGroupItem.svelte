<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getRadioGroupContext } from './context.js';

	type Props = Omit<HTMLInputAttributes, 'type' | 'name' | 'value' | 'checked'> & {
		value: string;
		ref?: HTMLInputElement | null;
	};

	let { value, disabled, ref = $bindable(null), class: className, ...rest }: Props = $props();

	const group = getRadioGroupContext();
</script>

<span class={['radio', className]}>
	<input
		{...rest}
		bind:this={ref}
		type="radio"
		name={group.name}
		{value}
		checked={group.value === value}
		disabled={group.disabled || disabled}
		required={group.required}
		onchange={(event) => {
			if (event.currentTarget.checked) group.select(value);
			rest.onchange?.(event);
		}}
	/>
	<span class="radio-indicator" aria-hidden="true"></span>
</span>

<style>
	@layer svelte-ui {
		.radio {
			position: relative;
			display: inline-flex;
			flex-shrink: 0;
			width: 16px;
			height: 16px;
		}

		input {
			appearance: none;
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			margin: 0;
			background-color: transparent;
			border: 1px solid var(--color-border-strong);
			border-radius: 50%;
			outline: none;
			cursor: pointer;
			transition:
				background-color 200ms ease,
				border-color 200ms ease;
		}

		input:checked {
			background-color: var(--color-accent);
			border-color: var(--color-accent);
		}

		input:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		input:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		.radio-indicator {
			position: absolute;
			inset: 4.5px;
			background-color: var(--color-accent-foreground);
			border-radius: 50%;
			pointer-events: none;
			transform: scale(0);
			transition: transform 200ms ease;
		}

		input:checked + .radio-indicator {
			transform: scale(1);
		}

		input:checked:disabled + .radio-indicator {
			opacity: 0.5;
		}

		@media (pointer: coarse) {
			input {
				position: relative;
			}

			input::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				width: max(100%, 44px);
				height: max(100%, 44px);
				transform: translate(-50%, -50%);
			}
		}

		@media (forced-colors: active) {
			input {
				border-color: ButtonText;
			}

			input:checked {
				background-color: Highlight;
				border-color: Highlight;
			}

			input:disabled {
				border-color: GrayText;
			}

			input:checked:disabled {
				background-color: GrayText;
			}

			.radio-indicator {
				background-color: HighlightText;
			}

			input:focus-visible {
				outline-color: Highlight;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			input,
			.radio-indicator {
				transition: none;
			}
		}
	}
</style>

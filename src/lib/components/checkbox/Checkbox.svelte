<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Check, Minus } from '@lucide/svelte';

	type Props = Omit<HTMLInputAttributes, 'type'> & {
		/** The input element. Bindable. */
		ref?: HTMLInputElement | null;
	};

	let {
		checked = $bindable(false),
		indeterminate = $bindable(false),
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();
</script>

<span class={['checkbox', className]}>
	<input {...rest} bind:this={ref} type="checkbox" bind:checked bind:indeterminate />
	{#if indeterminate}
		<Minus class="checkbox-icon" aria-hidden="true" />
	{:else}
		<Check class="checkbox-icon" aria-hidden="true" />
	{/if}
</span>

<style>
	@layer svelte-ui {
		.checkbox {
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
			border-radius: 5px;
			outline: none;
			cursor: pointer;
			transition:
				background-color 200ms ease,
				border-color 200ms ease;
		}

		input:checked,
		input:indeterminate {
			background-color: var(--color-accent);
			border-color: var(--color-accent);
		}

		input:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
		}

		input[aria-invalid='true'] {
			border-color: var(--color-destructive);
		}

		input:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		.checkbox :global(.checkbox-icon) {
			position: absolute;
			inset: 2px;
			width: 12px;
			height: 12px;
			color: var(--color-accent-foreground);
			stroke-width: 3;
			pointer-events: none;
			opacity: 0;
		}

		input:checked + :global(.checkbox-icon),
		input:indeterminate + :global(.checkbox-icon) {
			opacity: 1;
		}

		input:disabled + :global(.checkbox-icon) {
			opacity: 0;
		}

		input:checked:disabled + :global(.checkbox-icon),
		input:indeterminate:disabled + :global(.checkbox-icon) {
			opacity: 0.5;
		}

		@media (pointer: coarse) {
			.checkbox::before {
				content: '';
				position: absolute;
				inset: 0;
				box-sizing: border-box;
				border: 1px solid var(--color-border-strong);
				border-radius: 5px;
				transition:
					background-color 200ms ease,
					border-color 200ms ease;
			}

			.checkbox:has(input:checked)::before,
			.checkbox:has(input:indeterminate)::before {
				background-color: var(--color-accent);
				border-color: var(--color-accent);
			}

			.checkbox:has(input[aria-invalid='true'])::before {
				border-color: var(--color-destructive);
			}

			.checkbox:has(input:focus-visible)::before {
				outline: 2px solid var(--color-accent);
				outline-offset: 2px;
			}

			.checkbox:has(input:disabled)::before {
				opacity: 0.5;
			}

			input {
				position: absolute;
				inset: -14px;
				width: 44px;
				height: 44px;
				opacity: 0;
			}
		}

		@media (forced-colors: active) {
			input:checked,
			input:indeterminate {
				border-width: 2px;
				border-color: Highlight;
			}

			input:focus-visible {
				outline-color: Highlight;
			}

			input:disabled {
				border-color: GrayText;
				opacity: 1;
			}

			.checkbox :global(.checkbox-icon) {
				color: CanvasText;
			}

			.checkbox:has(input:disabled) :global(.checkbox-icon) {
				color: GrayText;
			}

			.checkbox::before {
				border-color: ButtonText;
			}

			.checkbox:has(input:checked)::before,
			.checkbox:has(input:indeterminate)::before {
				border-width: 2px;
				border-color: Highlight;
				background-color: Canvas;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			input,
			.checkbox::before {
				transition: none;
			}
		}
	}
</style>

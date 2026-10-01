<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'type' | 'role'> & {
		ref?: HTMLInputElement | null;
	};

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();
</script>

<span class={['switch', className]}>
	<input {...rest} bind:this={ref} type="checkbox" role="switch" bind:checked />
	<span class="switch-thumb" aria-hidden="true"></span>
</span>

<style>
	@layer svelte-ui {
		.switch {
			position: relative;
			display: inline-flex;
			flex-shrink: 0;
			width: 36px;
			height: 22px;
		}

		input {
			appearance: none;
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			margin: 0;
			background-color: var(--color-surface);
			border: 1px solid var(--color-border);
			border-radius: 9px;
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

		input[aria-invalid='true'] {
			border-color: var(--color-destructive);
		}

		input:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		/* Radius is the track's 9px minus the 4px inset, so the corners stay concentric */
		.switch-thumb {
			position: absolute;
			top: 4px;
			left: 4px;
			width: 14px;
			height: 14px;
			background-color: var(--color-base);
			border-radius: 5px;
			pointer-events: none;
			transition:
				transform 200ms ease,
				background-color 200ms ease;
		}

		input:checked + .switch-thumb {
			background-color: var(--color-accent-foreground);
			transform: translateX(14px);
		}

		input:disabled + .switch-thumb {
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
				border-color: GrayText;
			}

			.switch-thumb {
				background-color: ButtonText;
			}

			input:checked + .switch-thumb {
				background-color: HighlightText;
			}

			input:disabled + .switch-thumb {
				background-color: GrayText;
			}

			input:checked:disabled + .switch-thumb {
				background-color: HighlightText;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			input,
			.switch-thumb {
				transition: none;
			}
		}
	}
</style>

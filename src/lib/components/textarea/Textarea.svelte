<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = HTMLTextareaAttributes & {
		ref?: HTMLTextAreaElement | null;
	};

	let { value = $bindable(), ref = $bindable(null), class: className, ...rest }: Props = $props();
</script>

<textarea {...rest} bind:this={ref} bind:value class={['textarea', className]}></textarea>

<style>
	@layer svelte-ui {
		/* Grows with its content from a two-line minimum, like the Input's 32px height */
		.textarea {
			box-sizing: border-box;
			display: block;
			width: 100%;
			min-width: 0;
			min-height: 64px;
			padding: 6px 10px;
			font-family: inherit;
			font-size: 13px;
			line-height: 1.5;
			color: var(--color-text);
			background-color: transparent;
			border: 1px solid var(--color-border-strong);
			border-radius: 10px;
			outline: none;
			resize: vertical;
			field-sizing: content;
			transition: border-color 200ms ease;
		}

		.textarea::selection {
			color: var(--color-accent-foreground);
			background-color: var(--color-accent);
		}

		.textarea::placeholder {
			color: var(--color-text-faint);
		}

		.textarea:focus-visible {
			border-color: var(--color-accent);
			outline: 1px solid var(--color-accent);
		}

		.textarea[aria-invalid='true'] {
			border-color: var(--color-destructive);
		}

		.textarea[aria-invalid='true']:focus-visible {
			outline-color: var(--color-destructive);
		}

		.textarea:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		@media (pointer: coarse) {
			.textarea {
				min-height: 88px;
			}
		}

		@media (forced-colors: active) {
			.textarea {
				border-color: ButtonText;
			}

			.textarea:focus-visible {
				border-color: Highlight;
				outline: 2px solid Highlight;
			}

			.textarea:disabled {
				border-color: GrayText;
				color: GrayText;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.textarea {
				transition: none;
			}
		}
	}
</style>

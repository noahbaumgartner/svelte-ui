<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let { value = $bindable(), class: className, ...rest }: HTMLTextareaAttributes = $props();
</script>

<textarea {...rest} bind:value class={['textarea', className]}></textarea>

<style>
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
</style>

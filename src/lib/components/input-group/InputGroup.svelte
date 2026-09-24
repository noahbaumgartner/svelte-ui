<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** An Input plus InputGroupAddons, in any order. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} role="group" class={['input-group', className]}>
	{@render children()}
</div>

<style>
	.input-group {
		position: relative;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		height: 32px;
		font-size: 13px;
		color: var(--color-text);
		border: 1px solid var(--color-border-strong);
		border-radius: 10px;
		transition: border-color 200ms ease;
	}

	/* The group draws border and focus ring instead of the Input */
	.input-group > :global(.input),
	.input-group > :global(.input-wrapper > .input),
	.input-group > :global(.input:is(:focus-visible, [aria-invalid='true'])),
	.input-group > :global(.input-wrapper > .input:is(:focus-visible, [aria-invalid='true'])) {
		height: 30px;
		border: none;
		border-radius: 0;
		outline: none;
		background-color: transparent;
	}

	.input-group > :global(:is(.input, .input-wrapper)) {
		flex: 1;
	}

	.input-group:has(:global(.input:focus-visible)) {
		border-color: var(--color-ink);
		outline: 1px solid var(--color-ink);
	}

	.input-group:has(:global([aria-invalid='true'])) {
		border-color: var(--color-destructive);
		outline-color: var(--color-destructive);
	}

	.input-group:has(:global(.input:disabled)) {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.input-group:has(:global(.input:disabled)) :global(.input) {
		opacity: 1;
	}

	/* Tighten the input's padding next to an inline addon */
	.input-group:has(> :global(.input-group-addon--inline-start)) > :global(.input) {
		padding-left: 6px;
	}

	.input-group:has(> :global(.input-group-addon--inline-end)) > :global(.input) {
		padding-right: 6px;
	}

	/* Block addons stack above or below the input */
	.input-group:has(> :global(:is(.input-group-addon--block-start, .input-group-addon--block-end))) {
		flex-direction: column;
		align-items: stretch;
		height: auto;
	}

	.input-group:has(> :global(:is(.input-group-addon--block-start, .input-group-addon--block-end)))
		> :global(:is(.input, .input-wrapper)) {
		flex: none;
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Placement relative to the input, independent of the order in the markup. */
		align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
		/** InputGroupText, InputGroupButton, icons or other content. */
		children: Snippet;
	};

	let { align = 'inline-start', class: className, children, ...rest }: Props = $props();

	function focusInput(event: MouseEvent) {
		if ((event.target as HTMLElement).closest('button, a, input')) return;
		(event.currentTarget as HTMLElement).parentElement?.querySelector('input')?.focus();
	}
</script>

<div
	{...rest}
	class={['input-group-addon', `input-group-addon--${align}`, className]}
	onclick={focusInput}
>
	{@render children()}
</div>

<style>
	.input-group-addon {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 6px;
		height: 100%;
		color: var(--color-text-muted);
		cursor: text;
		user-select: none;
	}

	.input-group-addon :global(svg) {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	.input-group-addon--inline-start {
		order: -1;
		padding-left: 10px;
	}

	.input-group-addon--inline-end {
		order: 1;
		padding-right: 10px;
	}

	.input-group-addon--block-start {
		order: -1;
		height: auto;
		padding: 8px 10px 0;
	}

	.input-group-addon--block-end {
		order: 1;
		height: auto;
		padding: 0 10px 8px;
	}

	/* Buttons sit 4px from the border, like the Input's own controls */
	.input-group-addon--inline-start:has(> :global(.input-group-button:first-child)) {
		padding-left: 4px;
	}

	.input-group-addon--inline-end:has(> :global(.input-group-button:last-child)) {
		padding-right: 4px;
	}
</style>

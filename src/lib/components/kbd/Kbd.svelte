<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<kbd {...rest} class={['kbd', className]}>{@render children()}</kbd>

<style>
	.kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		box-sizing: border-box;
		width: fit-content;
		min-width: 20px;
		height: 20px;
		padding: 0 4px;
		font-family: inherit;
		font-size: 12px;
		line-height: 1;
		background-color: var(--color-surface);
		color: var(--color-text-muted);
		border-radius: 4px;
		pointer-events: none;
		user-select: none;
	}

	.kbd :global(svg) {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}

	:global(.button--primary) .kbd {
		background-color: color-mix(in srgb, var(--color-base) 20%, transparent);
		color: inherit;
	}
</style>

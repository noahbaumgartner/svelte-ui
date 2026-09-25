<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<kbd {...rest} class={['kbd-group', className]}>{@render children()}</kbd>

<style>
	.kbd-group {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: inherit;
		font-size: 12px;
		color: var(--color-text-muted);
	}

	:global(.tooltip-content) .kbd-group {
		color: inherit;
	}
</style>

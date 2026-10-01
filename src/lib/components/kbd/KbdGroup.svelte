<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		children: Snippet;
		ref?: HTMLElement | null;
	};

	let { class: className, children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<kbd {...rest} bind:this={ref} class={['kbd-group', className]}>{@render children()}</kbd>

<style>
	@layer svelte-ui {
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
	}
</style>

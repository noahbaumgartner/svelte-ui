<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** The page content next to the sidebar. */
		children: Snippet;
		ref?: HTMLElement | null;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<main {...rest} bind:this={ref} class={['sidebar-inset', className]}>
	{@render children()}
</main>

<style>
	@layer svelte-ui {
		.sidebar-inset {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;
			background-color: var(--color-bg);
		}
	}
</style>

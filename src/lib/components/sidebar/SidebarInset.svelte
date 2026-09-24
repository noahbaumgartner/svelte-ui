<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
		/** The page content next to the sidebar. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<main {...rest} class={['sidebar-inset', className]}>
	{@render children()}
</main>

<style>
	.sidebar-inset {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		background-color: var(--color-bg);
	}
</style>

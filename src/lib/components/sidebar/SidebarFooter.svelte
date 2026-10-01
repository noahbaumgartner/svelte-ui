<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		children: Snippet;
		ref?: HTMLDivElement | null;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['sidebar-footer', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.sidebar-footer {
			display: flex;
			flex-direction: column;
			gap: 8px;
			padding: 8px;
		}
	}
</style>

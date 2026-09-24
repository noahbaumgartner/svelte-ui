<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['sidebar-header', className]}>
	{@render children()}
</div>

<style>
	.sidebar-header {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;
	}
</style>

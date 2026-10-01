<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
		/** `SidebarMenuItem`s. */
		children: Snippet;
		ref?: HTMLUListElement | null;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<ul {...rest} bind:this={ref} class={['sidebar-menu', className]}>
	{@render children()}
</ul>

<style>
	@layer svelte-ui {
		.sidebar-menu {
			display: flex;
			flex-direction: column;
			gap: 2px;
			min-width: 0;
			margin: 0;
			padding: 0;
			list-style: none;
		}
	}
</style>

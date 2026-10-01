<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** `SidebarGroup`s. Scrolls when it overflows. */
		children: Snippet;
		ref?: HTMLDivElement | null;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['sidebar-content', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.sidebar-content {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-height: 0;
			overflow-x: hidden;
			overflow-y: auto;
		}

		:global(.sidebar--collapsed-icon) .sidebar-content {
			overflow: hidden;
		}
	}
</style>

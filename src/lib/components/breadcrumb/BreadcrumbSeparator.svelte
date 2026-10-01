<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	type Props = Omit<HTMLLiAttributes, 'children'> & {
		/** The li element. Bindable. */
		ref?: HTMLLIElement | null;
		/** Replaces the chevron. */
		children?: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<li
	{...rest}
	bind:this={ref}
	role="presentation"
	aria-hidden="true"
	class={['breadcrumb-separator', className]}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronRight />
	{/if}
</li>

<style>
	@layer svelte-ui {
		.breadcrumb-separator {
			display: flex;
		}

		.breadcrumb-separator :global(svg) {
			width: 14px;
			height: 14px;
		}
	}
</style>

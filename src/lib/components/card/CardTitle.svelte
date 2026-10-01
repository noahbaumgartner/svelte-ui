<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLHeadingElement | null;
		children: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<h3 {...rest} bind:this={ref} class={['card-title', className]}>
	{@render children()}
</h3>

<style>
	@layer svelte-ui {
		.card-title {
			margin: 0;
			font-size: 15px;
			font-weight: 600;
			line-height: 1.4;
		}
	}
</style>

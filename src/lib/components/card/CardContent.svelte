<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLDivElement | null;
		children: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['card-content', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.card-content {
			padding-inline: var(--card-spacing);
		}
	}
</style>

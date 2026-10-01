<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
		/** The root element. Bindable. */
		ref?: HTMLParagraphElement | null;
		children: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<p {...rest} bind:this={ref} class={['card-description', className]}>
	{@render children()}
</p>

<style>
	@layer svelte-ui {
		.card-description {
			margin: 0;
			font-size: 13px;
			line-height: 1.5;
			color: var(--color-text-muted);
		}
	}
</style>

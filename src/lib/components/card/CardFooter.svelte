<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Buttons or secondary content, primary Button first. */
		/** The root element. Bindable. */
		ref?: HTMLDivElement | null;
		children: Snippet;
	};

	let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['card-footer', className]}>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.card-footer {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 4px;
			margin-top: auto;
			padding: var(--card-spacing);
			background-color: color-mix(in srgb, var(--color-surface) 50%, transparent);
			border-top: 1px solid var(--color-border);
		}
	}
</style>

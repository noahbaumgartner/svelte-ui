<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		heading: string;
		/** Links, one per line. */
		children: Snippet;
		ref?: HTMLDivElement | null;
	};

	let { heading, class: className, children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<div {...rest} bind:this={ref} class={['footer-column', className]}>
	<span class="footer-column-heading">{heading}</span>
	{@render children()}
</div>

<style>
	@layer svelte-ui {
		.footer-column {
			display: flex;
			flex: 1;
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
			color: color-mix(in srgb, #fff, #000 17%);
		}

		.footer-column-heading {
			font-weight: 600;
			color: #fff;
			user-select: none;
		}
	}
</style>

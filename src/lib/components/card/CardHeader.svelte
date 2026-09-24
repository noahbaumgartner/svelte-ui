<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** CardTitle, CardDescription and optionally a CardAction. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['card-header', className]}>
	{@render children()}
</div>

<style>
	.card-header {
		display: grid;
		grid-auto-rows: min-content;
		align-items: start;
		gap: 4px;
		padding-inline: var(--card-spacing);
	}

	.card-header:has(> :global(.card-action)) {
		grid-template-columns: 1fr auto;
	}
</style>

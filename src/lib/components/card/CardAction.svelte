<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** E.g. a Button or Badge, placed top right in the CardHeader. */
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div {...rest} class={['card-action', className]}>
	{@render children()}
</div>

<style>
	.card-action {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: start;
		justify-self: end;
	}
</style>

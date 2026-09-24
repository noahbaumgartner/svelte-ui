<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
		children: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<p {...rest} class={['card-description', className]}>
	{@render children()}
</p>

<style>
	.card-description {
		margin: 0;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}
</style>
